// function sidebarColor(element) {
//     let color = element.getAttribute("data-color");
//     localStorage.setItem("sidebarColor", color);
//     console.log("Sidebar color saved:", color);
// }

// // Lưu loại sidebar
// function sidebarType(element) {
//     let type = element.getAttribute("data-class");
//     localStorage.setItem("sidebarType", type);
//     // Áp dụng thay đổi
// }

// // Lưu trạng thái navbar fixed
// function navbarFixed(element) {
//     let isChecked = element.checked;
//     localStorage.setItem("navbarFixed", isChecked);
// }

// // Lưu chế độ Dark Mode
// function darkMode(element) {
//     let isChecked = element.checked;
//     localStorage.setItem("darkMode", isChecked);
// }


// document.addEventListener("DOMContentLoaded", function () {
//     // Khôi phục sidebar color
//     let savedSidebarColor = localStorage.getItem("sidebarColor");
//     if (savedSidebarColor) {
//         let selectedColor = document.querySelector(`.badge[data-color="${savedSidebarColor}"]`);
//         if (selectedColor) {
//             selectedColor.click();
//         } else {
//             console.error("Không tìm thấy phần tử sidebar color:", savedSidebarColor);
//         }
//     }

//     // Khôi phục sidebar type
//     let savedSidebarType = localStorage.getItem("sidebarType");
//     if (savedSidebarType) {
//         let selectedType = document.querySelector(`button[data-class="${savedSidebarType}"]`);
//         if (selectedType) {
//             selectedType.click();
//         } else {
//             console.error("Không tìm thấy phần tử sidebar type:", savedSidebarType);
//         }
//     }

//     // Khôi phục trạng thái navbar fixed
//     let savedNavbarFixed = localStorage.getItem("navbarFixed");
//     if (savedNavbarFixed !== null) {  // Kiểm tra nếu nó tồn tại
//         let navbarFixedCheckbox = document.getElementById("navbarFixed");
//         if (navbarFixedCheckbox) {
//             navbarFixedCheckbox.checked = savedNavbarFixed === "true";
//             navbarFixed(navbarFixedCheckbox);
//         }
//     }

//     // Khôi phục chế độ Dark Mode
//     let savedDarkMode = localStorage.getItem("darkMode");
//     if (savedDarkMode !== null) {
//         let darkModeCheckbox = document.getElementById("dark-version");
//         if (darkModeCheckbox) {
//             darkModeCheckbox.checked = savedDarkMode === "true";
//             darkMode(darkModeCheckbox);
//         }
//     }
// });