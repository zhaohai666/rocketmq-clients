//! End-to-end check of every message type against a RocketMQ 5.x proxy.
//!
//! For each type the example produces a message and reads it back, then prints
//! a pass/fail line per type. The proxy and the topics have to exist already;
//! the proxy address comes from `ROCKETMQ_ACCESS_URL` and defaults to
//! `localhost:8081`.

use rocketmq::conf::{ClientOption, ProducerOption, PushConsumerOption, SimpleConsumerOption};
use rocketmq::model::common::{FilterExpression, FilterType};
use rocketmq::model::message::{MessageBuilder, MessageView};
use rocketmq::model::transaction::TransactionResolution;
use rocketmq::{ConsumeResult, Producer, PushConsumer, SimpleConsumer, Transaction};
use std::ops::Add;
use std::sync::{Arc, Mutex};
use std::time::{Duration, SystemTime, UNIX_EPOCH};

fn access_url() -> String {
    std::env::var("ROCKETMQ_ACCESS_URL").unwrap_or_else(|_| "localhost:8081".to_string())
}

fn client() -> ClientOption {
    let mut option = ClientOption::default();
    option.set_access_url(access_url());
    option.set_enable_tls(false);
    option
}

async fn producer(topics: Vec<&str>) -> Producer {
    let mut producer_option = ProducerOption::default();
    producer_option.set_topics(topics.iter().map(|t| t.to_string()).collect());
    let mut producer = Producer::new(producer_option, client()).unwrap();
    producer.start().await.unwrap();
    producer
}

/// Collect the bodies a push consumer receives for `seconds`.
async fn push_collect(
    group: &str,
    topic: &str,
    seconds: u64,
) -> Arc<Mutex<Vec<String>>> {
    let bodies: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));
    let sink = Arc::clone(&bodies);
    let mut option = PushConsumerOption::default();
    option.set_consumer_group(group);
    option.set_consumer_worker_count_each_queue(1);
    option.subscribe(topic, FilterExpression::new(FilterType::Tag, "*"));
    let callback: rocketmq::MessageListener = Box::new(move |message: &MessageView| {
        sink.lock()
            .unwrap()
            .push(String::from_utf8_lossy(message.body()).to_string());
        ConsumeResult::SUCCESS
    });
    let mut consumer = PushConsumer::new(client(), option, callback).unwrap();
    consumer.start().await.unwrap();
    tokio::time::sleep(Duration::from_secs(seconds)).await;
    let _ = consumer.shutdown().await;
    bodies
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();
    let mut results: Vec<(String, bool, String)> = Vec::new();

    // --- normal -----------------------------------------------------------
    {
        let mut producer = producer(vec!["m-normal"]).await;
        for index in 0..2 {
            let message = MessageBuilder::builder()
                .set_topic("m-normal")
                .set_body(format!("normal-{index}").into_bytes())
                .build()?;
            producer.send(message).await?;
        }
        producer.shutdown().await?;
        let mut option = SimpleConsumerOption::default();
        option.set_topics(vec!["m-normal".to_string()]);
        option.set_consumer_group("g-normal".to_string());
        let mut consumer = SimpleConsumer::new(option, client()).unwrap();
        consumer.start().await.unwrap();
        let mut got = Vec::new();
        for _ in 0..10 {
            match consumer
                .receive(
                    "m-normal".to_string(),
                    &FilterExpression::new(FilterType::Tag, "*"),
                )
                .await
            {
                Ok(messages) => {
                    for message in messages {
                        got.push(String::from_utf8_lossy(message.body()).to_string());
                    }
                }
                Err(_) => {}
            }
            if got.len() >= 2 {
                break;
            }
            tokio::time::sleep(Duration::from_millis(400)).await;
        }
        let _ = consumer.shutdown().await;
        let ok = got.len() == 2 && got.contains(&"normal-0".to_string());
        results.push(("normal".into(), ok, format!("{got:?}")));
    }

    // --- fifo -------------------------------------------------------------
    {
        let mut producer = producer(vec!["m-fifo"]).await;
        for index in 0..3 {
            let message = MessageBuilder::fifo_message_builder(
                "m-fifo",
                format!("fifo-{index}").into_bytes(),
                "message_group",
            )
            .build()?;
            producer.send(message).await?;
        }
        producer.shutdown().await?;
        let bodies = push_collect("g-fifo", "m-fifo", 6).await;
        let got = bodies.lock().unwrap().clone();
        let ordered = got == vec!["fifo-0", "fifo-1", "fifo-2"];
        results.push(("fifo".into(), ordered, format!("{got:?}")));
    }

    // --- priority ---------------------------------------------------------
    {
        let mut producer = producer(vec!["m-priority"]).await;
        for index in 0..2 {
            let message = MessageBuilder::priority_message_builder(
                "m-priority",
                format!("priority-{index}").into_bytes(),
                index,
            )
            .set_tag("PriorityTag")
            .build()?;
            producer.send(message).await?;
        }
        producer.shutdown().await?;
        let bodies = push_collect("g-priority", "m-priority", 5).await;
        let got = bodies.lock().unwrap().clone();
        let ok = got.len() == 2 && got.contains(&"priority-0".to_string());
        results.push(("priority".into(), ok, format!("{got:?}")));
    }

    // --- delay ------------------------------------------------------------
    {
        let mut producer = producer(vec!["m-delay"]).await;
        let deliver_at = SystemTime::now()
            .add(Duration::from_secs(8))
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;
        let message =
            MessageBuilder::delay_message_builder("m-delay", b"delay-body".to_vec(), deliver_at)
                .build()?;
        producer.send(message).await?;
        producer.shutdown().await?;
        let bodies = push_collect("g-delay", "m-delay", 14).await;
        let got = bodies.lock().unwrap().clone();
        let ok = got.iter().any(|body| body == "delay-body");
        results.push(("delay".into(), ok, format!("{got:?}")));
    }

    // --- transaction ------------------------------------------------------
    {
        let mut producer_option = ProducerOption::default();
        producer_option.set_topics(vec!["m-tx".to_string()]);
        let mut producer = Producer::new_transaction_producer(
            producer_option,
            client(),
            Box::new(|_transaction_id, _message| TransactionResolution::COMMIT),
        )
        .unwrap();
        producer.start().await.unwrap();
        let message =
            MessageBuilder::transaction_message_builder("m-tx", b"tx-body".to_vec()).build()?;
        let transaction = producer.send_transaction_message(message).await?;
        transaction.commit().await?;
        producer.shutdown().await?;
        let bodies = push_collect("g-tx", "m-tx", 6).await;
        let got = bodies.lock().unwrap().clone();
        let ok = got.iter().any(|body| body == "tx-body");
        results.push(("transaction".into(), ok, format!("{got:?}")));
    }

    // --- recall -----------------------------------------------------------
    {
        let mut producer = producer(vec!["m-recall"]).await;
        let deliver_at = SystemTime::now()
            .add(Duration::from_secs(30))
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;
        let message =
            MessageBuilder::delay_message_builder("m-recall", b"recall-body".to_vec(), deliver_at)
                .build()?;
        let receipt = producer.send(message).await?;
        let recalled = match receipt.recall_handle() {
            Some(handle) => producer
                .recall_message("m-recall", handle)
                .await
                .map(|id| format!("recalled {id}"))
                .unwrap_or_else(|e| format!("recall failed: {e:?}")),
            None => "no recall handle".to_string(),
        };
        producer.shutdown().await?;
        let bodies = push_collect("g-recall", "m-recall", 6).await;
        let got = bodies.lock().unwrap().clone();
        let ok = !got.iter().any(|body| body == "recall-body") && recalled.starts_with("recalled");
        results.push(("recall".into(), ok, format!("{recalled} / {got:?}")));
    }

    // --- report -----------------------------------------------------------
    println!("---- matrix ----");
    let mut failed = 0;
    for (name, ok, detail) in &results {
        println!("{:<12} {}  {detail}", name, if *ok { "PASS" } else { "FAIL" });
        if !*ok {
            failed += 1;
        }
    }
    if failed == 0 {
        println!("MATRIX-OK");
    } else {
        println!("MATRIX-FAIL {failed}");
        std::process::exit(1);
    }
    Ok(())
}
