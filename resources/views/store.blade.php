@extends('layouts/layoutMaster')

@section('title', 'Stores')

@section('vendor-style')
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/datatables-buttons-bs5/buttons.bootstrap5.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/select2/select2.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/@form-validation/umd/styles/index.min.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/animate-css/animate.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/sweetalert2/sweetalert2.css') }}" />

@endsection

@section('vendor-script')
    <script src="{{ asset('assets/vendor/libs/moment/moment.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/select2/select2.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/@form-validation/umd/bundle/popular.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/@form-validation/umd/plugin-bootstrap5/index.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/@form-validation/umd/plugin-auto-focus/index.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/cleavejs/cleave.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/cleavejs/cleave-phone.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/sweetalert2/sweetalert2.js') }}"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDaaQsorx7RXju4ceXDzLG0Gt26DYBfL3A&libraries=places"></script>

@endsection

@section('page-script')
    <script src="{{ asset('assets/js/store.js') }}"></script>
@endsection

@section('content')
    <h4 class="py-3 mb-4">
        <span class="text-muted fw-light">Quản lý /</span> Cửa hàng
    </h4>


    <!-- Stores List Table -->
    <div class="card">
        <div class="card-datatable table-responsive">
            <table class="datatables-stores table">
                <thead class="border-top">
                    <tr>
                        <th>Mã cửa hàng</th>
                        <th>Tên cửa hàng</th>
                        <th>Địa chỉ</th>
                        <th>Tỉnh/Thành phố</th>
                        <th>Latitude</th>
                        <th>Longtitude</th>
                    </tr>
                </thead>
            </table>
        </div>
        <!-- Offcanvas to add new store -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasAddStore" aria-labelledby="offcanvasAddStoreLabel">
            <div class="offcanvas-header">
                <h5 id="offcanvasAddStoreLabel" class="offcanvas-title">Thêm cửa hàng</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Đóng"></button>
            </div>
            <div class="offcanvas-body mx-0 flex-grow-0 pt-0 h-100">
                <form class="add-new-store pt-0" id="addNewStoreForm">
                    <div class="mb-3">
                        <label class="form-label" for="store-code">Mã cửa hàng</label>
                        <input type="text" class="form-control" id="store-code" placeholder="AD001" name="storeCode"
                            aria-label="AD001" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label" for="store-name">Tên cửa hàng</label>
                        <input type="text" class="form-control" id="store-name" placeholder="Cửa Hàng Số 7"
                            name="storeName" aria-label="Cửa Hàng Số 7" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label" for="store-address">Địa chỉ</label>
                        <input type="text" class="form-control" id="store-address" placeholder="10A, Trần Nhân Tông, Q12"
                            name="storeAddress" aria-label="10A, Trần Nhân Tông, Q12" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="store-province">Tỉnh thành</label>
                        <select id="store-province" class="form-select" name="storeProvince">
                            <option value="">Chọn Tỉnh thành</option>
                        </select>
                    </div>


                    <button type="submit" id="submitFormButton"
                        class="btn btn-primary me-sm-3 me-1 data-submit">Tạo</button>
                    <button type="reset" class="btn btn-label-secondary" data-bs-dismiss="offcanvas">Huỷ</button>
                </form>
            </div>
        </div>
    </div>

@endsection
