<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Show the login form.
     *
     * @return \Illuminate\View\View
     */    public function index()
    {
      return view('store');
    }
}