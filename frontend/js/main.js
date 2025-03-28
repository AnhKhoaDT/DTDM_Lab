// elements
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const listView = document.getElementById("list-view");
const boardView = document.getElementById("board-view");
const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const statusSelect = document.getElementById("status-select");
const statusDropdown = document.getElementById("status-dropdown");
const taskItems = document.querySelectorAll(".task-item");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const deleteTaskCTA = document.getElementById("delete-task-cta");
const notification = document.getElementById("notification");
const taskFormHeader = document.getElementById('task-form-header');
const dateFilterInput = document.getElementById('date-filter-input');
// the current active overlay
let activeOverlay = null;

//** event listeners **//

// radio buttons for view option
radioViewOptions.forEach((radioButton) => {
  radioButton.addEventListener("change", (event) => {
    const eventTarget = event.target;
    const viewOption = eventTarget.value;

    switch (viewOption) {
      case "list":
        boardView.classList.add("hide");
        listView.classList.remove("hide");
        break;
      case "board":
        listView.classList.add("hide");
        boardView.classList.remove("hide");
        break;
    }
  });
});

// add task
addTaskCTA.addEventListener("click", () => {
  setTaskOverlay.classList.remove("hide");
  document.getElementById('task-form-header').textContent = 'Add task';
  document.getElementById('submit-button').textContent = 'Add task';
  // Reset form
  document.querySelector('#set-task-overlay form').reset();
  activeOverlay = setTaskOverlay;
  // disable scrolling for content behind the overlay
  document.body.classList.add("overflow-hidden");
});

// close buttons inside overlays
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeOverlay.classList.add("hide");
    activeOverlay = null;
    // reenable scrolling
    document.body.classList.remove("overflow-hidden");
  });
});

// open status dropdown
statusSelect.addEventListener("click", () => {
  statusDropdown.classList.toggle("hide");
});

// click a task
taskItems.forEach((task) => {
    task.addEventListener("click", () => {
        // Lấy dữ liệu từ task được nhấn
        const taskName = task.querySelector('.task-name').textContent;
        const taskDueDate = task.querySelector('.task-due-date').textContent.replace('Due on ', '');
        
        // Cập nhật nội dung trong view task overlay
        const viewTaskOverlay = document.getElementById('view-task-overlay');
        
        // Cập nhật tên
        viewTaskOverlay.querySelector('.header.no-margin + .value').textContent = taskName;
        
        // Cập nhật mô tả (tạm thời giữ nguyên vì chưa có dữ liệu mô tả trong task item)
        // viewTaskOverlay.querySelector('.header + .value').textContent = "...";
        
        // Cập nhật ngày
        viewTaskOverlay.querySelector('.header.min-width + .value').textContent = taskDueDate;
        
        // Xác định status dựa vào class của parent
        let status = 'To do';
        if (task.closest('.blue') || task.closest('.list-container.blue')) {
            status = 'Doing';
        } else if (task.closest('.green') || task.closest('.list-container.green')) {
            status = 'Done';
        }
        
        // Cập nhật status và màu sắc circle
        const statusValue = viewTaskOverlay.querySelector('.status-value');
        statusValue.querySelector('span:last-child').textContent = status;
        
        // Cập nhật màu của circle
        const circle = statusValue.querySelector('.circle');
        circle.className = 'circle'; // Reset class
        switch(status) {
            case 'To do':
                circle.classList.add('pink-background');
                break;
            case 'Doing':
                circle.classList.add('blue-background');
                break;
            case 'Done':
                circle.classList.add('green-background');
                break;
        }

        // Hiển thị overlay
        viewTaskOverlay.classList.remove("hide");
        activeOverlay = viewTaskOverlay;
        document.body.classList.add("overflow-hidden");
    });
});

// delete a task
deleteTaskCTA.addEventListener("click", () => {
  activeOverlay.classList.add("hide");
  activeOverlay = null;
  // reenable scrolling
  document.body.classList.remove("overflow-hidden");
  // show notification & hide it after a while
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
});

// Thêm biến cho nút edit
const editTaskButton = document.querySelector('.view-task-overlay .control-buttons-container button:first-child');

// Hàm để thêm event listener cho nút đóng
function addCloseButtonListeners() {
    const closeButtons = document.querySelectorAll(".close-button");
    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const overlay = button.closest('.overlay');
            if (overlay) {
                overlay.classList.add("hide");
                activeOverlay = null;
                document.body.classList.remove("overflow-hidden");
            }
        });
    });
}

// Gọi hàm này khi trang được load
document.addEventListener('DOMContentLoaded', addCloseButtonListeners);

// Sửa lại event listener cho nút edit
editTaskButton.addEventListener('click', function() {
    // Lấy dữ liệu task từ view task overlay
    const taskData = {
        name: document.querySelector('.view-task-overlay .header.no-margin + .value').textContent.trim(),
        description: document.querySelector('.view-task-overlay .value').textContent.trim(),
        dueDate: document.querySelector('.view-task-overlay .header.min-width + .value').textContent.trim(),
        status: document.querySelector('.view-task-overlay .status-value span:last-child').textContent.trim()
    };

    // Đóng view task overlay
    viewTaskOverlay.classList.add('hide');
    
    // Mở set task overlay
    setTaskOverlay.classList.remove('hide');
    activeOverlay = setTaskOverlay;
    
    // Đảm bảo nút đóng hoạt động
    addCloseButtonListeners();

    // Điền dữ liệu vào form
    document.getElementById('name').value = taskData.name;
    document.getElementById('description').value = taskData.description;
    
    // Xử lý due date
    const dateParts = taskData.dueDate.split(' ');
    document.getElementById('due-date-day').value = dateParts[1].replace(',', '');
    document.getElementById('due-date-month').value = new Date(Date.parse(taskData.dueDate)).getMonth() + 1;
    document.getElementById('due-date-year').value = dateParts[2];
    
    // Xử lý status
    const statusSelect = document.getElementById('status-select');
    statusSelect.querySelector('span').textContent = taskData.status;
});

// Thêm event listener cho date filter
dateFilterInput.addEventListener('change', (event) => {
    const selectedDate = event.target.value;
    // Thêm logic lọc task theo ngày ở đây
    console.log('Selected date:', selectedDate);
});

// Thêm event listener cho nút All
document.querySelector('.header-controls .white-background').addEventListener('click', () => {
    // Thêm logic hiển thị tất cả tasks ở đây
    console.log('Show all tasks');
});

// Thêm event listener cho nút filter
document.querySelector('.circle-button.white-background').addEventListener('click', () => {
    // Thêm logic mở filter options ở đây
    console.log('Open filter options');
});
