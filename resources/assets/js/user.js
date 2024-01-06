/**
 * Page Client List
 */

'use strict';

// Variable declaration for table
var dt_user_table = $('.datatables-users');
var dt_user;

let userData = 'http://127.0.0.1:8000/api/users';


document.addEventListener('DOMContentLoaded', function () {


  const addNewUserForm = document.getElementById('addNewUserForm');
  const submitButton = document.getElementById('submitFormButton');

  // Initialize Form Validation
  const fv = FormValidation.formValidation(addNewUserForm, {
    fields: {
      userFullname: {
        validators: {
          notEmpty: {
            message: 'Thiếu tên tài khoản' // Missing client's name
          }
        }
      },
      userUsername: {
        validators: {
          notEmpty: {
            message: 'Thiếu tài khoản' // Missing client's name
          }
        }
      },

      userPassword: {
        validators: {
          notEmpty: {
            message: 'Thiếu mật khẩu' // Missing client's name
          },
          stringLength: {
            min: 6,
            message: 'Mật khẩu phải có tối thiểu 6 ký tự'
          }
        }
      }
    },

    plugins: {
      trigger: new FormValidation.plugins.Trigger(),
      bootstrap5: new FormValidation.plugins.Bootstrap5({
        eleValidClass: '',
        rowSelector: function (field, ele) {
          return '.mb-3';
        }
      }),
      submitButton: new FormValidation.plugins.SubmitButton(),
      autoFocus: new FormValidation.plugins.AutoFocus()
    }
  });

  // Function to handle form submission
  function handleFormSubmission() {
    const name = document.getElementById('user-fullname').value;
    const username = document.getElementById('user-username').value;
    const password = document.getElementById('user-password').value;

    const type = document.getElementById('user-type').value;

    const data = {
      full_name: name,
      username: username,
      password: password,
      type: type,
      active: true
    };

    fetch(userData, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          // If response is not ok, parse and throw an error
          return response.json().then(err => {
            // Extract the error message from the 'username' array
            const errorMessage = err.username ? err.username[0] : 'An unknown error occurred';
            throw new Error(errorMessage);
          });
        }
        return response.json();
      })
      .then(data => {
        // Assuming 'data' is the object containing user info
        dt_user.rows
          .add([{
            id: data.id,
            full_name: data.full_name,
            username: data.username,
            type: data.type,
            active: "Hoạt động",
            created_at: formatAnyDate()
          }])
          .draw();
        Swal.fire({
          title: 'Thành công!',
          text: 'Thêm tài khoản thành công!',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        });
      })
      .catch(error => {
        Swal.fire({
          title: 'Lỗi!',
          text: error.message, // Display the extracted error message
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        });
      });
  }

  // Attach event listener to form's submit event
  submitButton.addEventListener('click', function (e) {
    e.preventDefault();
    fv.validate().then(function (status) {
      if (status === 'Valid') {
        handleFormSubmission();
      }
    });
  });
});

// Function to handle AJAX requests
async function makeAjaxRequest(url, method, requestData) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (method !== 'GET') {
      options.body = JSON.stringify(requestData);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function extractTextFromHTML(inner) {
  if (inner.length <= 0) return inner;
  var el = $.parseHTML(inner);
  var result = '';
  $.each(el, function (index, item) {
    if (item.classList !== undefined && item.classList.contains('name')) {
      result = result + item.lastChild.firstChild.textContent;
    } else if (item.innerText === undefined) {
      result = result + item.textContent;
    } else result = result + item.innerText;
  });
  return result;
}

function customizePrintView(win) {
  $(win.document.body).css('color', headingColor).css('border-color', borderColor).css('background-color', bodyBg);
  $(win.document.body)
    .find('table')
    .addClass('compact')
    .css('color', 'inherit')
    .css('border-color', 'inherit')
    .css('background-color', 'inherit');
}

// Function to handle AJAX requests and return a Promise
async function makeAjaxRequestPromise(url, method, requestData) {
  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function formatAnyDate(dateString = new Date()) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const dateToFormat = new Date(dateString);
  return dateToFormat.toLocaleDateString('en-GB', options);
}


// Datatable (jquery)
$(function () {
  let borderColor, bodyBg, headingColor;

  if (isDarkStyle) {
    borderColor = config.colors_dark.borderColor;
    bodyBg = config.colors_dark.bodyBg;
    headingColor = config.colors_dark.headingColor;
  } else {
    borderColor = config.colors.borderColor;
    bodyBg = config.colors.bodyBg;
    headingColor = config.colors.headingColor;
  }

  // Users datatable
  if (dt_user_table.length) {
    dt_user = dt_user_table.DataTable({
      columnDefs: [
        {
          targets: [0],
          title: 'ID',
          render: function (data, type, full, meta) {
            return '<span class="fw-medium">' + full['id'] + '</span>';
          }
        },
        {
          targets: [1],
          title: 'Họ và tên',
          render: function (data, type, full, meta) {
            var $name = full['full_name'];
            // For Avatar badge
            var stateNum = Math.floor(Math.random() * 6);
            var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
            var $state = states[stateNum],
              $initials = $name.match(/\b\w/g) || [];
            $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
            var $output = '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';

            var $row_output =
              '<div class="d-flex justify-content-start align-items-center user-name">' +
              '<div class="avatar-wrapper">' +
              '<div class="avatar me-2">' +
              $output +
              '</div>' +
              '</div>' +
              '<div class="d-flex flex-column">' +
              '<span class="fw-medium">' +
              $name +
              '</span>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },
        {
          targets: [2],
          title: 'Tài khoản',
          render: function (data, type, full, meta) {
            return '<span class="fw-medium">' + full['username'] + '</span>';
          }
        },
        {
          targets: [3],
          title: 'Loại tài khoản',
          render: function (data, type, full, meta) {
            return '<span class="fw-medium">' + full['type'] + '</span>';
          }
        },
        {
          targets: [4],
          title: 'Trạng thái',
          render: function (data, type, full, meta) {
            return '<span class="fw-medium">' + full['active'] + '</span>';
          }
        },
        {
          targets: [5],
          title: 'Ngày tạo',
          render: function (data, type, full, meta) {
            return '<span class="fw-medium">' + formatAnyDate(full['created_at']) + '</span>';
          }
        },
        {
          targets: [-1],
          title: 'Chức năng',
          orderable: false,
          searchable: false,
          render: function (data, type, full, meta) {
            return (
              '<div class="d-flex align-items-center">' +
              '<a href="javascript:;" id="toggle-active" class="text-body toggle-active"><i class="ti ti-player-stop ti-sm mx-2"></i></a>' +
              '<a href="javascript:;" id="del-btn" class="text-body delete-record"><i class="ti ti-trash ti-sm mx-2"></i></a>' +
              '</div>'
            );
          }
        }
      ],
      order: [[1, 'desc']],
      dom:
        '<"row me-2"' +
        '<"col-md-2"<"me-3"l>>' +
        '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>' +
        '>t' +
        '<"row mx-2"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: '_MENU_',
        search: '',
        searchPlaceholder: 'Tìm kiếm..'
      },
      buttons: [
        {
          extend: 'collection',
          text: '<i class="ti ti-screen-share me-1 ti-xs"></i>Xuất File',
          className: 'btn btn-label-secondary dropdown-toggle mx-3',
          buttons: [
            {
              extend: 'print',
              text: '<i class="ti ti-printer me-2"></i>Print',
              className: 'dropdown-item',
              exportOptions: {
                columns: [0, 1, 2, 3, 4],
                format: {
                  body: function (inner, coldex, rowdex) {
                    return extractTextFromHTML(inner);
                  }
                }
              },
              customize: function (win) {
                customizePrintView(win);
              }
            },
            {
              extend: 'csv',
              text: '<i class="ti ti-file-text me-2"></i>Csv',
              className: 'dropdown-item',
              exportOptions: {
                columns: [0, 1, 2, 3, 4],
                format: {
                  body: function (inner, coldex, rowdex) {
                    return extractTextFromHTML(inner);
                  }
                }
              }
            },
            {
              extend: 'excel',
              text: '<i class="ti ti-file-spreadsheet me-2"></i>Excel',
              className: 'dropdown-item',
              exportOptions: {
                columns: [0, 1, 2, 3, 4],
                format: {
                  body: function (inner, coldex, rowdex) {
                    return extractTextFromHTML(inner);
                  }
                }
              }
            },
            {
              extend: 'pdf',
              text: '<i class="ti ti-file-code-2 me-2"></i>Pdf',
              className: 'dropdown-item',
              exportOptions: {
                columns: [0, 1, 2, 3, 4],
                format: {
                  body: function (inner, coldex, rowdex) {
                    return extractTextFromHTML(inner);
                  }
                }
              }
            },
            {
              extend: 'copy',
              text: '<i class="ti ti-copy me-2"></i>Copy',
              className: 'dropdown-item',
              exportOptions: {
                columns: [0, 1, 2, 3, 4],
                format: {
                  body: function (inner, coldex, rowdex) {
                    return extractTextFromHTML(inner);
                  }
                }
              }
            }
          ]
        },
        {
          text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Thêm tài khoản</span>',
          className: 'add-new btn btn-primary',
          attr: {
            'data-bs-toggle': 'offcanvas',
            'data-bs-target': '#offcanvasAddUser'
          }
        }
      ]
    });

    makeAjaxRequest(userData, 'GET', {}).then(function (response) {
      if (Array.isArray(response) && response.length > 0) {
        response.forEach(function (user) {
          user.active = user.active == 1 ? "Hoạt động" : "Tạm dừng";
          // Directly add user object to DataTable
          dt_user.rows.add([user]).draw();
        });
      }
    });

    // Handle Delete Record
    $('.datatables-users tbody').on('click', '.delete-record', function () {
      var row = $(this).closest('tr');
      var data = dt_user.row(row).data();
      var id = data.id;

      Swal.fire({
        title: 'Xác nhận xoá tài khoản?',
        text: 'Không thể hoàn tác nếu như xác nhận!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Chắc chắn!',
        customClass: {
          confirmButton: 'btn btn-primary me-3',
          cancelButton: 'btn btn-label-secondary'
        },
        buttonsStyling: false
      }).then(function (result) {
        if (result.value) {
          // Send a delete request to the server
          fetch(userData + '/' + id, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              // Additional headers if needed
            },
          })
            .then(function () {
              // Remove the row from the DataTable
              dt_user.row(row).remove().draw();
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Đã xoá tài khoản.',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
            })
            .catch(error => {
              console.error(error);
            });
        }
      });
    });

    // Handle Toggle Active Status
    $('.datatables-users tbody').on('click', '.toggle-active', function () {
      var row = $(this).closest('tr');
      var data = dt_user.row(row).data();
      var id = data.id; // Assuming 'id' is the property that holds the record's ID
      var isActive = data.active; // Assuming 'active' is a boolean

      var newStatus = !isActive; // Toggle the status
      if (newStatus == 1) var dataStatus = "true"; else dataStatus = "false";
      var actionText = isActive ? 'vô hiệu hóa' : 'kích hoạt';

      Swal.fire({
        title: `Xác nhận ${actionText} tài khoản?`,
        text: `Bạn có chắc chắn muốn ${actionText} tài khoản này?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Chắc chắn!',
        customClass: {
          confirmButton: 'btn btn-primary me-3',
          cancelButton: 'btn btn-label-secondary'
        },
        buttonsStyling: false
      }).then(function (result) {
        if (result.value) {
          // Send a request to the server to toggle the active status
          fetch(userData + '/' + id, {
            method: 'PUT', // Or 'PATCH', depending on your API
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active: dataStatus })
          })
            .then(data => {
              // Update the UI to reflect the new status
              Swal.fire({
                icon: 'success',
                title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} thành công!`,
                text: `Tài khoản đã được ${actionText}.`,
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              // Update the data object with the new status
              data.active = newStatus;
              // Redraw the row with updated data
              dt_user.row(row).data(data).draw();
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
      });
    });
  }

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});
