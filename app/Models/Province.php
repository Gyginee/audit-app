<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;

    protected $fillable = [
      'name',
      'division_type',
      'codename',
      'phone_code',
      'province_id', // Updated column name
  ];


    public function stores()
    {
        return $this->hasMany(Store::class);
    }
}
