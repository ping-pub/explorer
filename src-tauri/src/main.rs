#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem, MenuItem};

#[tauri::command]
fn my_custom_command(msg: String) -> String {
  println!("I was invoked from JS! {}", msg);
  return "Hello from Rust".into()
}

fn main() {
  // here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide = CustomMenuItem::new("hide".to_string(), "Hide");
  let tray_menu = SystemTrayMenu::new()
      .add_item(quit)
      .add_native_item(SystemTrayMenuItem::Separator)
      .add_item(hide);
  let tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
      .system_tray(tray)
      // This is where you pass in your commands
      .invoke_handler(tauri::generate_handler![my_custom_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
