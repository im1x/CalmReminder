mod models;

use std::fs::File;
use std::io::BufReader;
use std::thread;

use models::response::Task;

use rodio::Decoder;
use rodio::{OutputStream, Sink};

#[tauri::command]
fn get_tasks() -> Vec<Task> {
    let file = File::open("settings.json");
    match file {
        Ok(file) => return serde_json::from_reader(file).expect("Failed to deserialize tasks"),
        Err(_) => return Vec::new(),
    }
}

#[tauri::command]
fn save_tasks(tasks: Vec<Task>) {
    println!("Saving tasks!");
    let tasks_json = serde_json::to_string(&tasks).expect("Failed to serialize tasks");
    std::fs::write("settings.json", tasks_json).unwrap();
}

#[tauri::command]
fn get_sounds() -> Vec<String> {
    let mut files = Vec::new();
    for entry in std::fs::read_dir("./sounds").expect("Failed to read directory: ./sounds") {
        let entry = entry.expect("Failed to read entry");
        let path = entry.path();
        if path.is_file() {
            files.push(
                path.file_stem()
                    .and_then(|stem| stem.to_str())
                    .expect("Failed to convert path to string")
                    .to_string(),
            );
        }
    }
    files
}

#[tauri::command]
fn play_sound(file_name: &str) {
    // Construct the file path
    let file_path = format!("./sounds/{}.mp3", file_name);

    thread::spawn(move || {
        // Create an output stream and a handle for playback
        let (_stream, stream_handle) =
            OutputStream::try_default().expect("Failed to create output stream");
        let sink = Sink::try_new(&stream_handle).expect("Failed to create sink");

        // Load the MP3 file
        let file = File::open(&file_path).expect("Failed to open file");
        let source = Decoder::new(BufReader::new(file)).expect("Failed to decode MP3");

        // Play the audio
        sink.append(source);

        // Keep the thread alive until playback completes
        sink.sleep_until_end();
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_tasks, save_tasks, get_sounds, play_sound
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
