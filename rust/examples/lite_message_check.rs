//! End-to-end check of the lite topic flow against a RocketMQ 5.x proxy.
//!
//! The proxy that serves the topic has to exist already; the example sends
//! three lite messages to a parent topic and checks that a lite consumer only
//! receives the two whose lite topic it subscribed to.
//!
//! The proxy address comes from `ROCKETMQ_ACCESS_URL` and defaults to
//! `localhost:8081`.

use rocketmq::conf::{ClientOption, ProducerOption, PushConsumerOption};
use rocketmq::model::message::{MessageBuilder, MessageView};
use rocketmq::{ConsumeResult, LitePushConsumer, LitePushConsumerTrait, Producer};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::time::Duration;

fn access_url() -> String {
    std::env::var("ROCKETMQ_ACCESS_URL").unwrap_or_else(|_| "localhost:8081".to_string())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    // --- produce -----------------------------------------------------------
    let mut client_option = ClientOption::default();
    client_option.set_access_url(access_url());
    let mut producer_option = ProducerOption::default();
    producer_option.set_topics(vec!["lite-parent".to_string()]);
    let mut producer = Producer::new(producer_option, client_option.clone())?;
    producer.start().await?;
    for index in 1..=3u32 {
        let lite_topic = format!("lite-topic-{index}");
        let body = format!("lite-body-{index}");
        let message = MessageBuilder::lite_message_builder(
            "lite-parent",
            body.clone().into_bytes(),
            &lite_topic,
        )
        .build()?;
        let receipt = producer.send(message).await?;
        println!(
            "sent lite message to {lite_topic}: id={} body={body}",
            receipt.message_id()
        );
    }
    producer.shutdown().await?;

    // --- consume -----------------------------------------------------------
    let received = Arc::new(AtomicUsize::new(0));
    let seen = Arc::new(std::sync::Mutex::new(Vec::<String>::new()));
    let counter = Arc::clone(&received);
    let collector = Arc::clone(&seen);
    let message_listener = Box::new(move |message: &MessageView| {
        let lite_topic = message.lite_topic().unwrap_or_default().to_string();
        let body = String::from_utf8_lossy(message.body()).to_string();
        println!(
            "received message: topic={:?} lite_topic={lite_topic} body={body}",
            message.topic()
        );
        counter.fetch_add(1, Ordering::SeqCst);
        collector.lock().unwrap().push(format!("{lite_topic}:{body}"));
        ConsumeResult::SUCCESS
    });

    let mut option = PushConsumerOption::default();
    option.set_consumer_group("lite-group");
    option.set_consumer_worker_count_each_queue(1);
    let mut consumer = LitePushConsumer::new(
        client_option,
        option,
        "lite-parent".to_string(),
        message_listener,
    )?;
    consumer.start().await?;
    println!("lite consumer started");
    consumer.subscribe_lite("lite-topic-1".to_string()).await?;
    consumer.subscribe_lite("lite-topic-2".to_string()).await?;
    println!("subscribed: {:?}", consumer.get_lite_topic_set());

    for _ in 0..30 {
        tokio::time::sleep(Duration::from_millis(500)).await;
        if received.load(Ordering::SeqCst) >= 2 {
            break;
        }
    }
    let got = seen.lock().unwrap().clone();
    println!("---- result ----");
    println!("received {} messages", received.load(Ordering::SeqCst));
    for item in &got {
        println!("  {item}");
    }
    consumer.shutdown().await?;
    let expected = ["lite-topic-1:lite-body-1", "lite-topic-2:lite-body-2"];
    let mut sorted = got.clone();
    sorted.sort();
    if sorted == expected {
        println!("LITE-OK");
        Ok(())
    } else {
        println!("LITE-FAIL");
        std::process::exit(1);
    }
}
