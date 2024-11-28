use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    id: u64,
    title: String,
    time_end: u32,
    time: u32,
    is_paused: bool,
    is_cyclic: bool,
    is_completed: bool,
    sound: String,
}
