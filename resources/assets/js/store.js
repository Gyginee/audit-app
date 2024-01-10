/**
 * Page Client List
 */

'use strict';

// Variable declaration for table
var dt_store_table = $('.datatables-stores');
var dt_store;

let storeData = baseUrl + 'api/stores';

document.addEventListener('DOMContentLoaded', function () {

  fetch('https://provinces.open-api.vn/api/p/')
  .then(response => response.json())
  .then(provinces => {
    const provinceSelect = document.getElementById('store-province');
    provinces.forEach(province => {
      const option = document.createElement('option');
      option.value = province.code;
      option.textContent = province.name;
      provinceSelect.appendChild(option);
    });
  });

  const addNewStoreForm = document.getElementById('addNewStoreForm');
  const submitButton = document.getElementById('submitFormButton');

  // Initialize Form Validation
  const fv = FormValidation.formValidation(addNewStoreForm, {
    fields: {
      storeName: {
        validators: {
          notEmpty: {
            message: 'Thiếu tên cửa hàng'
          }
        }
      },
      storeCode: {
        validators: {
          notEmpty: {
            message: 'Thiếu mã cửa hàng'
          }
        }
      },

      storeAddress: {
        validators: {
          notEmpty: {
            message: 'Thiếu địa chỉ'
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
    const store_name = document.getElementById('store-name').value;
    const store_code = document.getElementById('store-code').value;
    const store_address = document.getElementById('store-address').value;

    let latitude, longitude;

    try {
      // Cố gắng lấy tọa độ từ địa chỉ
      const coords =  getLatitudeLongitude(store_address);
      latitude = coords.latitude;
      longitude = coords.longitude;
    } catch (error) {
      console.error('Error getting location: ', error);
      // Đặt giá trị mặc định hoặc để trống
      latitude = undefined;
      longitude = undefined;
    }

    const data = {
      store_code: store_code,
      store_name: store_name,
      address: store_address,
      lat: latitude,
      long: longitude
    };

    fetch(storeData, {
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
            // Extract the error message from the 'storename' array
            const errorMessage = err.storename ? err.storename[0] : 'An unknown error occurred';
            throw new Error(errorMessage);
          });
        }
        return response.json();
      })
      .then(data => {
        // Assuming 'data' is the object containing store info
        dt_store.rows
          .add([
            {
              id: data.id,
              full_name: data.full_name,
              storename: data.storename,
              type: data.type,
              active: 'Hoạt động',
              created_at: formatAnyDate()
            }
          ])
          .draw();
        Swal.fire({
          title: 'Thành công!',
          text: 'Thêm cửa hàng thành công!',
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

async function getLatitudeLongitude(address) {
  return new Promise((resolve, reject) => {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        resolve({ latitude, longitude });
      } else {
        reject("Geocode was not successful for the following reason: " + status);
      }
    });
  });
}

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

  // Stores datatable
  if (dt_store_table.length) {
    dt_store = dt_store_table.DataTable({
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
            var $output =
              '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';

            var $row_output =
              '<div class="d-flex justify-content-start align-items-center store-name">' +
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
            return '<span class="fw-medium">' + full['storename'] + '</span>';
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
              '<a href="javascript:;" id="toggle-active" class="text-body toggle-active"><i class="ti ti-status-change ti-sm mx-2"></i></a>' +
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
            'data-bs-target': '#offcanvasAddStore'
          }
        }
      ]
    });

    makeAjaxRequest(storeData, 'GET', {}).then(function (response) {
      if (Array.isArray(response) && response.length > 0) {
        response.forEach(function (store) {
          store.active = store.active == 1 ? 'Hoạt động' : 'Tạm dừng';
          // Directly add store object to DataTable
          dt_store.rows.add([store]).draw();
        });
      }
    });

    // Handle Delete Record
    $('.datatables-stores tbody').on('click', '.delete-record', function () {
      var row = $(this).closest('tr');
      var data = dt_store.row(row).data();
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
          fetch(storeData + '/' + id, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
              // Additional headers if needed
            }
          })
            .then(function () {
              // Remove the row from the DataTable
              dt_store.row(row).remove().draw();
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
    $('.datatables-stores tbody').on('click', '.toggle-active', function () {
      var row = $(this).closest('tr');
      var data = dt_store.row(row).data();
      var id = data.id;

      // Determine if the current status is 'Active'
      var isActive = data.active === 'Hoạt động';

      // Convert the text to boolean for the API request
      var newStatusForApi = !isActive;

      // Determine the action text
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
          fetch(storeData + '/' + id, {
            method: 'PUT', // Or 'PATCH', depending on your API
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ active: newStatusForApi })
          })
            .then(response => response.json())
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

              // Convert the API response back to text
              var newStatusForTable = data.active ? 'Hoạt động' : 'Tạm dừng';

              // Update the data object with the new status
              data.active = newStatusForTable;

              // Redraw the row with updated data
              dt_store.row(row).data(data).draw();
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
