<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $primaryKey = 'store_code';
    public $incrementing = false;
    protected $fillable = ['store_code', 'store_name', 'address', 'province_id', 'latitude', 'longitude'];

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public function auditRoundOnes()
    {
        return $this->hasMany(AuditRoundOne::class, 'store_code');
    }

    public function auditRoundTwos()
    {
        return $this->hasMany(AuditRoundTwo::class, 'store_code');
    }
}
