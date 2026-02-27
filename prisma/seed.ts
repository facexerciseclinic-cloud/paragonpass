// ============================================================================
// Paragonpass - Database Seed Script
// ============================================================================
// Run with: npm run db:seed (or: npx tsx prisma/seed.ts)
//
// This script:
// 1. Creates the 3 Pass tiers (Silver, Gold, Paragon)
// 2. Creates all Categories
// 3. Creates all Products with their per-pass pricing rules
// 4. Creates a default admin user
//
// DATA CONVENTIONS from the clinic spreadsheet:
//   price = 0   → Gold/Paragon inherits Silver price (or normal if no silver)
//                  equivalent to "/" symbol - accessible at best available price
//   price = -1  → "-" symbol - NOT accessible for this pass tier (locked)
//   price > 0   → Specific discounted price for this tier
// ============================================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ============================================================================
// PASS DEFINITIONS
// ============================================================================
const passesData = [
  {
    name: "Silver Pass",
    slug: "silver",
    upfrontFee: 299,
    description: "เข้าถึงราคาพิเศษระดับ Silver สำหรับหัตถการที่เลือกได้",
    conditionsText:
      "ซื้อได้ไม่จำกัดจำนวนต่อครั้ง เฉพาะรายการที่เปิดให้ Silver เท่านั้น",
    maxItems: null, // unlimited
    validityDays: null, // per session
    sortOrder: 1,
  },
  {
    name: "Gold Pass",
    slug: "gold",
    upfrontFee: 999,
    description:
      "เข้าถึงราคา Silver ได้ไม่จำกัด + ราคา Gold สูงสุด 4 รายการ",
    conditionsText:
      "ซื้อรายการ Silver ได้ไม่จำกัด + รายการ Gold ได้สูงสุด 4 รายการต่อครั้ง",
    maxItems: 4, // max 4 gold-tier items
    validityDays: null, // per session
    sortOrder: 2,
  },
  {
    name: "Paragon Card",
    slug: "paragon",
    upfrontFee: 2999,
    description: "เข้าถึงราคาพิเศษสุดทุกรายการ ใช้ได้ 3 เดือน",
    conditionsText:
      "ซื้อได้ไม่จำกัดจำนวนทุกรายการในราคา Paragon ใช้ได้ 3 เดือน",
    maxItems: null, // unlimited
    validityDays: 90, // 3 months
    sortOrder: 3,
  },
];

// ============================================================================
// PRODUCT DATA - from clinic spreadsheet
// ============================================================================
// Convention: silver_price/gold_price/paragon_price:
//   0  = accessible, uses best available price (inherits from lower tier or promo)
//   -1 = not accessible (locked / "-")
//   >0 = specific price for that tier
// ============================================================================
const categoriesData = [
  {
    category_name: "Drip ผิว",
    products: [
      { name: "Immune", normal_price: 699, promo_price: 990, silver_price: 590, gold_price: 0, paragon_price: 0 },
      { name: "Brighter Skin", normal_price: 999, promo_price: 1290, silver_price: 890, gold_price: 0, paragon_price: 0 },
      { name: "Skin Detox", normal_price: 1190, promo_price: 1490, silver_price: 1190, gold_price: 0, paragon_price: 0 },
      { name: "Brighter Skin Plus", normal_price: 1499, promo_price: 1790, silver_price: 1390, gold_price: 0, paragon_price: 0 },
      { name: "Renew", normal_price: 1590, promo_price: 1890, silver_price: 1590, gold_price: 0, paragon_price: 0 },
      { name: "All Star", normal_price: 2290, promo_price: 2590, silver_price: 1990, gold_price: 0, paragon_price: 0 },
      { name: "All star plus", normal_price: 2390, promo_price: 2890, silver_price: 2390, gold_price: 0, paragon_price: 0 },
      { name: "Liver Detox", normal_price: 1990, promo_price: 2290, silver_price: 1890, gold_price: 0, paragon_price: 0 },
      { name: "Max Energy (NAD+)", normal_price: 7900, promo_price: 8190, silver_price: 7790, gold_price: 0, paragon_price: 0 },
    ],
  },
  {
    category_name: "Acne สิว",
    products: [
      { name: "ฉีดสิวอักเสบ 1 เม็ด", normal_price: 100, promo_price: 200, silver_price: 99, gold_price: 0, paragon_price: 0 },
      { name: "ฉีดสิวอักเสบ 5 เม็ด", normal_price: 100, promo_price: 450, silver_price: 299, gold_price: 0, paragon_price: 0 },
      { name: "ฉีดสิวอักเสบ 10 เม็ด", normal_price: 100, promo_price: 700, silver_price: 499, gold_price: 0, paragon_price: 0 },
      { name: "กดสิว (ทั่วหน้า)", normal_price: 300, promo_price: 500, silver_price: 299, gold_price: 0, paragon_price: 0 },
      { name: "Acne light แสงสีน้ำเงิน", normal_price: 300, promo_price: 400, silver_price: 299, gold_price: 0, paragon_price: 0 },
      { name: "Collagen light แสงสีแดง", normal_price: 300, promo_price: 400, silver_price: 299, gold_price: 0, paragon_price: 0 },
      { name: "Acne Block", normal_price: 1590, promo_price: 1790, silver_price: 1390, gold_price: 0, paragon_price: 0 },
      { name: "Stop Acne", normal_price: 590, promo_price: 790, silver_price: 390, gold_price: 0, paragon_price: 0 },
      { name: "Baby Acne", normal_price: 890, promo_price: 1090, silver_price: 690, gold_price: 0, paragon_price: 0 },
      { name: "Stop Acne Plus", normal_price: 990, promo_price: 1390, silver_price: 790, gold_price: 0, paragon_price: 0 },
      { name: "Stop Acne Clear", normal_price: 1190, promo_price: 1790, silver_price: 990, gold_price: 0, paragon_price: 0 },
      { name: "Super Stop Acne Clear", normal_price: 1990, promo_price: 2490, silver_price: 1690, gold_price: 0, paragon_price: 0 },
      { name: "Supreme Stop Acne Clear", normal_price: 2590, promo_price: 3190, silver_price: 2290, gold_price: 0, paragon_price: 0 },
      { name: "Ultimate Stop Acne Clear", normal_price: 3590, promo_price: 4190, silver_price: 3290, gold_price: 0, paragon_price: 0 },
      { name: "ให้มันจบที่ 3,000", normal_price: 3000, promo_price: 3000, silver_price: 3000, gold_price: 2500, paragon_price: 0 },
      { name: "ให้มันจบที่ 4,000", normal_price: 4000, promo_price: 4000, silver_price: 4000, gold_price: 3500, paragon_price: 0 },
      { name: "สิวจบที่ 6,000", normal_price: 6000, promo_price: 6000, silver_price: 6000, gold_price: 5500, paragon_price: 0 },
      { name: "PP", normal_price: 1590, promo_price: 1790, silver_price: 1290, gold_price: 0, paragon_price: 0 },
      { name: "PPP", normal_price: 1990, promo_price: 2190, silver_price: 1690, gold_price: 0, paragon_price: 0 },
    ],
  },
  {
    category_name: "ลดรอยดำ รอยแดง (รวม Laser)",
    products: [
      { name: "ฉีดลดรอยดำ", normal_price: 1999, promo_price: 1999, silver_price: 1690, gold_price: 0, paragon_price: 0 },
      { name: "Bright Laser, APL Laser", normal_price: 1500, promo_price: 1500, silver_price: 1290, gold_price: 0, paragon_price: 0 },
      { name: "Quadrostar Bright Tone", normal_price: 1900, promo_price: 1900, silver_price: 1590, gold_price: 0, paragon_price: 0 },
      { name: "Quadrostar Bright Red Clear", normal_price: 1900, promo_price: 1900, silver_price: 1590, gold_price: 0, paragon_price: 0 },
      { name: "577 Yellow laser - หลังคอ", normal_price: 2000, promo_price: 2290, silver_price: 1690, gold_price: 0, paragon_price: 0 },
      { name: "577 Yellow laser - แผ่นหลัง", normal_price: 6000, promo_price: 6290, silver_price: 5690, gold_price: 0, paragon_price: 0 },
      { name: "577 Yellow laser - ก้น", normal_price: 5000, promo_price: 5290, silver_price: 4690, gold_price: 0, paragon_price: 0 },
      { name: "577 Yellow laser - รักแร้ 2 ข้าง", normal_price: 2000, promo_price: 2290, silver_price: 1690, gold_price: 0, paragon_price: 0 },
      { name: "577 Yellow laser - แขน 2 ข้าง", normal_price: 4000, promo_price: 4290, silver_price: 3690, gold_price: 0, paragon_price: 0 },
      { name: "577 Yellow laser - ข้อศอก/หลังมือ/หลังเท้า 2 ข้าง", normal_price: 1500, promo_price: 1790, silver_price: 1190, gold_price: 0, paragon_price: 0 },
      { name: "577 Yellow laser - ขาบน/ขาล่าง 2 ข้าง", normal_price: 4000, promo_price: 4290, silver_price: 3690, gold_price: 0, paragon_price: 0 },
      { name: "577 Yellow laser - หัวเข่า 2 ข้าง", normal_price: 2000, promo_price: 2290, silver_price: 1690, gold_price: 0, paragon_price: 0 },
      { name: "577 Yellow Laser + Laser Plasma Heal", normal_price: 2990, promo_price: 2990, silver_price: 2490, gold_price: 0, paragon_price: 0 },
      { name: "ขาหนีบดำ", normal_price: 2950, promo_price: 2950, silver_price: 2390, gold_price: 0, paragon_price: 0 },
    ],
  },
  {
    category_name: "รักษาฝ้า",
    products: [
      { name: "Melasma away mini", normal_price: 999, promo_price: 999, silver_price: 590, gold_price: 0, paragon_price: 0 },
      { name: "ตัวยาพิเศษฉีดฝ้า", normal_price: 1000, promo_price: 1000, silver_price: 690, gold_price: 0, paragon_price: 0 },
      { name: "Melasma away", normal_price: 1999, promo_price: 1999, silver_price: 1690, gold_price: 0, paragon_price: 0 },
      { name: "Melasma away บุฟเฟต์", normal_price: 6590, promo_price: 6590, silver_price: -1, gold_price: 6290, paragon_price: 0 },
      { name: "Melasma away premium", normal_price: 2499, promo_price: 2499, silver_price: 2190, gold_price: 0, paragon_price: 0 },
      { name: "Super melasma away", normal_price: 2590, promo_price: 2590, silver_price: 2290, gold_price: 0, paragon_price: 0 },
      { name: "Supreme melasma away", normal_price: 3590, promo_price: 3590, silver_price: 3290, gold_price: 0, paragon_price: 0 },
      { name: "Ultimate Melasma Away", normal_price: 4490, promo_price: 4490, silver_price: 4190, gold_price: 0, paragon_price: 0 },
      { name: "ฝ้า 7แถม14 (3 ขั้นตอน 7 ครั้ง)", normal_price: 3900, promo_price: 3900, silver_price: 3490, gold_price: 0, paragon_price: 0 },
      { name: "ให้มันจบที่ 6,000 (ฝ้า)", normal_price: 6000, promo_price: 6000, silver_price: -1, gold_price: 5490, paragon_price: 0 },
      { name: "Melasma Skin Shoot", normal_price: 14900, promo_price: 14900, silver_price: -1, gold_price: 13490, paragon_price: 0 },
      { name: "CPRE", normal_price: 3990, promo_price: 3990, silver_price: 3390, gold_price: 0, paragon_price: 0 },
      { name: "ฝ้าจางแบบสบายใจ ระดับ 1", normal_price: 5490, promo_price: 5490, silver_price: 4890, gold_price: 0, paragon_price: 0 },
      { name: "ฝ้าจางแบบสบายใจ ระดับ 2", normal_price: 8490, promo_price: 8490, silver_price: -1, gold_price: 7890, paragon_price: 0 },
      { name: "ฝ้าจางแบบสบายใจ ระดับ 3", normal_price: 10490, promo_price: 10490, silver_price: -1, gold_price: 9590, paragon_price: 0 },
    ],
  },
  {
    category_name: "หลุมสิว",
    products: [
      { name: "Subcision 1 ครั้ง", normal_price: 1599, promo_price: 1599, silver_price: 1290, gold_price: 0, paragon_price: 0 },
      { name: "FGF Subcision", normal_price: 4900, promo_price: 4900, silver_price: -1, gold_price: 4790, paragon_price: 0 },
      { name: "Hya Regen lab Subcision", normal_price: 19900, promo_price: 19900, silver_price: -1, gold_price: -1, paragon_price: 18290 },
      { name: "EPN Scar repair", normal_price: 2590, promo_price: 2590, silver_price: -1, gold_price: 2190, paragon_price: 0 },
    ],
  },
  {
    category_name: "ฉีดหน้าใส",
    products: [
      { name: "Meso หน้าใส", normal_price: 590, promo_price: 590, silver_price: 390, gold_price: 0, paragon_price: 0 },
      { name: "Meso หน้าใส พรีเมี่ยม", normal_price: 990, promo_price: 990, silver_price: 790, gold_price: 0, paragon_price: 0 },
      { name: "Meso หน้าใส ซุปเปอร์พรีเมี่ยม", normal_price: 1290, promo_price: 1290, silver_price: 990, gold_price: 0, paragon_price: 0 },
      { name: "Shine Diamond", normal_price: 2590, promo_price: 2590, silver_price: 2290, gold_price: 0, paragon_price: 2090 },
      { name: "Skin Booster", normal_price: 1590, promo_price: 1590, silver_price: 1290, gold_price: 0, paragon_price: 990 },
      { name: "Double Skin Booster", normal_price: 1990, promo_price: 1990, silver_price: 1690, gold_price: 0, paragon_price: 1590 },
      { name: "Super Skin Booster", normal_price: 2590, promo_price: 2590, silver_price: 2290, gold_price: 0, paragon_price: 2090 },
      { name: "Skin Barrier", normal_price: 1590, promo_price: 1590, silver_price: 1290, gold_price: 0, paragon_price: 1190 },
      { name: "Double Collagen Booster", normal_price: 1990, promo_price: 1990, silver_price: 1690, gold_price: 0, paragon_price: 1590 },
      { name: "Super Skin Barrier", normal_price: 2590, promo_price: 2590, silver_price: 2290, gold_price: 0, paragon_price: 2090 },
      { name: "Skin celeb", normal_price: 3900, promo_price: 3900, silver_price: 3590, gold_price: 0, paragon_price: 3490 },
      { name: "Double Skin celeb", normal_price: 4999, promo_price: 4999, silver_price: 4690, gold_price: 0, paragon_price: 4490 },
      { name: "Super Skin celeb", normal_price: 5999, promo_price: 5999, silver_price: -1, gold_price: 5490, paragon_price: 0 },
      { name: "supreme skin celeb", normal_price: 5900, promo_price: 5900, silver_price: -1, gold_price: 5390, paragon_price: 0 },
      { name: "ฉีดหน้าใส Chanel 1 ขวด", normal_price: 1900, promo_price: 1900, silver_price: 1690, gold_price: 0, paragon_price: 0 },
      { name: "Unlimited Snow aura", normal_price: 3500, promo_price: 3500, silver_price: -1, gold_price: 2990, paragon_price: 0 },
      { name: "NCTF 135 HA เต็มขวด 3 cc", normal_price: 9990, promo_price: 9990, silver_price: -1, gold_price: 7590, paragon_price: 6590 },
    ],
  },
  {
    category_name: "FILLER",
    products: [
      { name: "Neuramis Deep 1 cc.", normal_price: 3900, promo_price: 4900, silver_price: 3900, gold_price: 3500, paragon_price: 0 },
      { name: "Neuramis Volume 1 cc.", normal_price: 4900, promo_price: 5900, silver_price: 4800, gold_price: 4500, paragon_price: 0 },
      { name: "Youthfill (ยกเว้นใต้ตา) 1 cc.", normal_price: 4900, promo_price: 4900, silver_price: 4800, gold_price: 4600, paragon_price: 0 },
      { name: "Youthfill Fine เติมใต้ตา 1 cc.", normal_price: 5900, promo_price: 5900, silver_price: 5800, gold_price: 5600, paragon_price: 0 },
      { name: "Restylane Vital Light 1 cc.", normal_price: 14900, promo_price: 14900, silver_price: -1, gold_price: 13900, paragon_price: 0 },
      { name: "Restylane Lyft 1 cc.", normal_price: 14900, promo_price: 14900, silver_price: -1, gold_price: 13900, paragon_price: 0 },
      { name: "Restylane Kysse 1 cc.", normal_price: 12900, promo_price: 12900, silver_price: -1, gold_price: 11900, paragon_price: 0 },
      { name: "Art Filler 1 cc.", normal_price: 13900, promo_price: 12900, silver_price: -1, gold_price: 12900, paragon_price: 0 },
      { name: "Belotero Intense 1 cc.", normal_price: 13900, promo_price: 12900, silver_price: -1, gold_price: 12900, paragon_price: 0 },
      { name: "Belotero Volume 1 cc.", normal_price: 13900, promo_price: 12900, silver_price: -1, gold_price: 12900, paragon_price: 0 },
      { name: "Belotero Soft 1 cc.", normal_price: 13900, promo_price: 12900, silver_price: -1, gold_price: 12900, paragon_price: 0 },
      { name: "Belotero Revive 1 cc.", normal_price: 13900, promo_price: 13900, silver_price: -1, gold_price: 12900, paragon_price: 0 },
      { name: "Art, Restyและ Belo ทุกรุ่น หมอเด่นฉีด", normal_price: 16900, promo_price: 16900, silver_price: -1, gold_price: 15900, paragon_price: 0 },
    ],
  },
  {
    category_name: "Botox",
    products: [
      { name: "Hutox 100 U", normal_price: 4900, promo_price: 4900, silver_price: 4490, gold_price: 3990, paragon_price: 3590 },
      { name: "Neuronox 100 U", normal_price: 6900, promo_price: 6900, silver_price: 6590, gold_price: 5990, paragon_price: 0 },
      { name: "Dysport 100 U", normal_price: 14900, promo_price: 14900, silver_price: -1, gold_price: 13900, paragon_price: 0 },
      { name: "Xeomin 100 U", normal_price: 16900, promo_price: 16900, silver_price: -1, gold_price: 15900, paragon_price: 0 },
      { name: "Allergan 100 U", normal_price: 23900, promo_price: 23900, silver_price: -1, gold_price: 22900, paragon_price: 0 },
    ],
  },
  {
    category_name: "Collagen Biostimulator",
    products: [
      { name: "Radiesse Classic", normal_price: 27500, promo_price: 29500, silver_price: -1, gold_price: 26500, paragon_price: 0 },
      { name: "Radiesse Plus +", normal_price: 29500, promo_price: 31500, silver_price: -1, gold_price: 28500, paragon_price: 0 },
      { name: "Radiesse+ 135 HA", normal_price: 45900, promo_price: 47900, silver_price: -1, gold_price: 44900, paragon_price: 0 },
      { name: "RR Mix", normal_price: 39000, promo_price: 41900, silver_price: -1, gold_price: 38000, paragon_price: 0 },
      { name: "Sculptra", normal_price: 22900, promo_price: 25900, silver_price: -1, gold_price: 22400, paragon_price: 0 },
      { name: "Sculptra Glow", normal_price: 30000, promo_price: 33900, silver_price: -1, gold_price: 28400, paragon_price: 0 },
      { name: "Gouri", normal_price: 14900, promo_price: 16900, silver_price: -1, gold_price: 13900, paragon_price: 0 },
      { name: "Juvelook 1 ขวด", normal_price: 15900, promo_price: 17900, silver_price: -1, gold_price: 14900, paragon_price: 0 },
    ],
  },
  {
    category_name: "เครื่องยกกระชับ",
    products: [
      { name: "Ultherapy 100 shots", normal_price: 15000, promo_price: 15000, silver_price: -1, gold_price: 13500, paragon_price: 0 },
      { name: "Ultraformer 3 100 shots", normal_price: 2500, promo_price: 2500, silver_price: 2000, gold_price: 0, paragon_price: 0 },
      { name: "Ultraformer MPT 100 shots", normal_price: 3750, promo_price: 3750, silver_price: 3450, gold_price: 0, paragon_price: 0 },
      { name: "Duet V 100 shots", normal_price: 4990, promo_price: 4990, silver_price: 4590, gold_price: 3790, paragon_price: 0 },
      { name: "Collagen Wave 5000 Wave", normal_price: 5000, promo_price: 5000, silver_price: 4000, gold_price: 0, paragon_price: 3000 },
      { name: "Oligio 100 shots", normal_price: 6500, promo_price: 6500, silver_price: 6000, gold_price: 0, paragon_price: 4500 },
      { name: "Oligio X 100 shots", normal_price: 7500, promo_price: 7500, silver_price: 6800, gold_price: 0, paragon_price: 6000 },
      { name: "Sylgold X Plus", normal_price: 11900, promo_price: 11900, silver_price: -1, gold_price: 11390, paragon_price: 10590 },
      { name: "Xerf 100 shots", normal_price: 10000, promo_price: 10000, silver_price: -1, gold_price: 9400, paragon_price: 8500 },
    ],
  },
  {
    category_name: "ฉีดไขมัน",
    products: [
      { name: "Fat BB 10 cc", normal_price: 690, promo_price: 690, silver_price: 590, gold_price: 0, paragon_price: 390 },
      { name: "Fat 15 cc (1 เท่า)", normal_price: 999, promo_price: 999, silver_price: 890, gold_price: 0, paragon_price: 690 },
      { name: "Fat 15 cc premium (2 เท่า)", normal_price: 1299, promo_price: 1299, silver_price: 1190, gold_price: 0, paragon_price: 990 },
      { name: "Fat Out", normal_price: 1590, promo_price: 1990, silver_price: 1390, gold_price: 0, paragon_price: 1190 },
      { name: "Double Fat Out", normal_price: 1990, promo_price: 2900, silver_price: 1790, gold_price: 0, paragon_price: 1590 },
      { name: "Super Fat Out", normal_price: 2590, promo_price: 2900, silver_price: 2390, gold_price: 0, paragon_price: 2190 },
      { name: "Fat Out buffet (3 เท่า)", normal_price: 3900, promo_price: 3900, silver_price: 3700, gold_price: 0, paragon_price: 3500 },
      { name: "Super Fat Out buffet (5 เท่า)", normal_price: 5900, promo_price: 5900, silver_price: 5600, gold_price: 0, paragon_price: 5300 },
      { name: "Fat bomb buffet (10 เท่า)", normal_price: 6900, promo_price: 6900, silver_price: 6600, gold_price: 0, paragon_price: 6300 },
      { name: "Fat Detox 1 โดส", normal_price: 8900, promo_price: 8900, silver_price: 8700, gold_price: 0, paragon_price: 8300 },
      { name: "Fat Burn (20 เท่า) 40 cc", normal_price: 9900, promo_price: 9900, silver_price: 9700, gold_price: 0, paragon_price: 9200 },
      { name: "Fat Lean (30 เท่า) 40 cc", normal_price: 11900, promo_price: 11900, silver_price: 11600, gold_price: 0, paragon_price: 10900 },
    ],
  },
];

// ============================================================================
// HELPER: Generate URL-friendly slug from Thai/English name
// ============================================================================
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\sก-๙]/g, "") // keep alphanumeric, whitespace, Thai chars
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================
async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data (order matters for foreign key constraints)
  await prisma.productPassPricing.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.pass.deleteMany();
  await prisma.user.deleteMany();
  console.log("  ✓ Cleared existing data");

  // ---- 1. Create Admin User ----
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@paragonpass.com",
      password: hashedPassword,
      name: "Admin",
      role: "superadmin",
    },
  });
  console.log(`  ✓ Created admin user: ${admin.email}`);

  // ---- 2. Create Passes ----
  const createdPasses: Record<string, string> = {}; // slug -> id
  for (const passData of passesData) {
    const pass = await prisma.pass.create({ data: passData });
    createdPasses[pass.slug] = pass.id;
    console.log(`  ✓ Created pass: ${pass.name} (${pass.upfrontFee} THB)`);
  }

  // ---- 3. Create Categories & Products ----
  let totalProducts = 0;
  let totalPricingRules = 0;

  for (let catIdx = 0; catIdx < categoriesData.length; catIdx++) {
    const catData = categoriesData[catIdx];
    const category = await prisma.category.create({
      data: {
        name: catData.category_name,
        slug: slugify(catData.category_name) || `category-${catIdx}`,
        sortOrder: catIdx,
        isActive: true,
      },
    });
    console.log(
      `  ✓ Created category: ${category.name} (${catData.products.length} products)`
    );

    for (let prodIdx = 0; prodIdx < catData.products.length; prodIdx++) {
      const prodData = catData.products[prodIdx];

      const product = await prisma.product.create({
        data: {
          categoryId: category.id,
          name: prodData.name,
          normalPrice: prodData.promo_price,
          promoPrice: prodData.normal_price,
          sortOrder: prodIdx,
          isActive: true,
        },
      });
      totalProducts++;

      // ---- 4. Create Pass Pricing Rules ----
      const tierPrices: { slug: string; price: number }[] = [
        { slug: "silver", price: prodData.silver_price },
        { slug: "gold", price: prodData.gold_price },
        { slug: "paragon", price: prodData.paragon_price },
      ];

      for (const tier of tierPrices) {
        const passId = createdPasses[tier.slug];
        if (!passId) continue;

        let isAccessible = true;
        let usesBestPrice = false;
        let specialPrice: number | null = null;

        if (tier.price === -1) {
          // "-" symbol: NOT accessible for this tier
          isAccessible = false;
        } else if (tier.price === 0) {
          // "/" or "0" symbol: Accessible, uses best available price
          // For Gold/Paragon with 0, they inherit the Silver price (best available)
          usesBestPrice = true;
        } else {
          // Specific price for this tier
          specialPrice = tier.price;
        }

        await prisma.productPassPricing.create({
          data: {
            productId: product.id,
            passId: passId,
            specialPrice,
            isAccessible,
            usesBestPrice,
          },
        });
        totalPricingRules++;
      }
    }
  }

  console.log(`\n🎉 Seed complete!`);
  console.log(`   - 1 admin user`);
  console.log(`   - ${Object.keys(createdPasses).length} passes`);
  console.log(`   - ${categoriesData.length} categories`);
  console.log(`   - ${totalProducts} products`);
  console.log(`   - ${totalPricingRules} pricing rules`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
