/**
 * Page Client List
 */

'use strict';

// Variable declaration for table
var dt_store_table = $('.datatables-stores');
var dt_store;

// Global object to store provinces data
var provincesData = {};

let storeData = baseUrl + 'api/stores';

document.addEventListener('DOMContentLoaded', function () {

  // Fetch provinces data and populate select dropdown
  fetch('https://provinces.open-api.vn/api/p/')
    .then(response => response.json())
    .then(provinces => {
      const provinceSelect = document.getElementById('store-province');
      provinces.forEach(province => {
        provincesData[province.code] = province.name; // Store province data
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
    const province_id = document.getElementById('store-province').value;
    let latitude, longitude;

    try {
      // Cố gắng lấy tọa độ từ địa chỉ
      const coords = getLatitudeLongitude(store_address);
      latitude = coords.latitude;
      longitude = coords.longitude;
    } catch (error) {
      console.error('Error getting location: ', error);
      // Đặt giá trị mặc định hoặc để trống
      latitude = "Không xác định";
      longitude = "Không xác định";
    }

    const data = {
      store_code: store_code,
      store_name: store_name,
      address: store_address,
      province_id: province_id,
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

// Function to get province name from ID
function getProvinceName(id) {
  return provincesData[id] || 'Unknown Province';
}

async function getLatitudeLongitude(address) {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDaaQsorx7RXju4ceXDzLG0Gt26DYBfL3A`);

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;
      return { latitude, longitude };
    } else {
      throw new Error('Geocoding was not successful');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
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
          title: 'Mã cửa hàng',
          render: function (data, type, full, meta) {
            return '<span class="fw-medium">' + full['store_code'] + '</span>';
          }
        },
        {
          targets: [1],
          title: 'Tên cửa hàng',
          render: function (data, type, full, meta) {
            var $name = full['store_name'];

            var $row_output =
              '<div class="d-flex justify-content-start align-items-center store-name">' +
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
          title: 'Địa chỉ',
          render: function (data, type, full, meta) {
            return '<span class="fw-medium">' + full['address'] + '</span>';
          }
        },
        {
          targets: [3],
          title: 'Tỉnh/Thành phố',
          render: function (data, type, full, meta) {
            return '<span class="fw-medium">' + getProvinceName(full['province_id']) + '</span>';
          }
        },
        {
          targets: [4],

          title: 'Latitude',
          render: function (data, type, full, meta) {
            /*  if (full['latitude']==null){
               const coords =  getLatitudeLongitude(full['address']);
               var latitude = coords.latitude;
               return '<span class="fw-medium">' + latitude + '</span>';
             }else {
               return '<span class="fw-medium">' + full['latitude'] + '</span>';
             } */
            const coords = getLatitudeLongitude(full['address']);
            var latitude = coords.latitude;
            return '<span class="fw-medium">' + latitude + '</span>';
          }
        },
        {
          targets: [5],
          title: 'Longitude',
          render: function (data, type, full, meta) {
            if (full['longitude'] == null) {
              const coords = getLatitudeLongitude(full['address']);
              var longitude = coords.longitude;
              return '<span class="fw-medium">' + longitude + '</span>';
            } else {
              return '<span class="fw-medium">' + full['longitude'] + '</span>';
            }
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
                columns: [0, 1, 2, 3],
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
                columns: [0, 1, 2, 3],
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
                columns: [0, 1, 2, 3],
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
                columns: [0, 1, 2, 3],
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
                columns: [0, 1, 2, 3],
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
        title: 'Xác nhận xoá cửa hàng?',
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
                text: 'Đã xoá cửa hàng.',
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
  }

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});
