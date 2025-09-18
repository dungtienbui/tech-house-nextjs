import { faker } from "@faker-js/faker";
import { Account, Employee, Customer, ProductBase, PhoneSpecs, LaptopSpecs, HeadphoneSpecs, KeyboardSpecs, Color, Variant, PhoneVariant, LaptopVariant, HeadphoneVariant, KeyboardVariant, PromotionType, Promotion, ProductPromotion, Review, ProductImage, ProductBaseImage, VariantImage } from "../definations/database-table-definations";

// =====================
// Account & Roles
// =====================
// Hàm tạo một account fake
export function generateFakeAccount(): Account {
  return {
    id: faker.string.uuid(), // UUID
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    full_name: faker.person.fullName(),
    phone_number: faker.phone.number(),
    address: faker.location.streetAddress(),
    gender: faker.helpers.arrayElement(['male', 'female', 'other']),
    date_of_birth: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
    role: faker.helpers.arrayElement(['admin', 'employee', 'customer']),
    registration_date: faker.date.past().toISOString(),
  };
}

// Hàm tạo Employee fake
export function generateFakeEmployee(account: Account): Employee {
  return {
    employee_id: account.id, // FK đến Account.id
    national_id: faker.string.numeric(12), // số CMND/CCCD giả
  };
}

// Hàm tạo Customer fake
export function generateFakeCustomer(account: Account): Customer {
  return {
    customer_id: account.id, // FK đến Account.id
    customer_points: faker.number.int({ min: 0, max: 5000 }), // điểm thưởng giả
  };
}

// =====================
// ProductBase
// =====================
export function generateFakeProductBase(productType: "PHONE" | "LAPTOP" | "KEYBOARD" | "HEADPHONE"): ProductBase {
  return {
    product_base_id: faker.string.uuid(),
    product_name: `${productType} - ${faker.commerce.productName()}`,
    brand: faker.company.name(),
    product_type: productType,
    description: faker.commerce.productDescription(),
    base_price: faker.number.int({ min: 100, max: 2000 }),
  };
}

// =====================
// PhoneSpecs
// =====================
export function generateFakePhoneSpecs(productBase: ProductBase): PhoneSpecs {
  return {
    product_base_id: productBase.product_base_id,
    operating_system: faker.helpers.arrayElement(["Android", "iOS"]),
    display: `${faker.number.int({ min: 5, max: 7 })}" ${faker.helpers.arrayElement([
      "AMOLED",
      "LCD",
      "OLED",
    ])}`,
    front_camera: `${faker.number.int({ min: 5, max: 32 })}MP`,
    rear_camera: `${faker.number.int({ min: 12, max: 108 })}MP`,
    battery_capacity: faker.number.int({ min: 3000, max: 6000 }),
    sim: faker.helpers.arrayElement(["Single SIM", "Dual SIM"]),
    connectivity: faker.helpers.arrayElement(["4G", "5G", "Wi-Fi", "Bluetooth"]),
  };
}

// =====================
// LaptopSpecs
// =====================
export function generateFakeLaptopSpecs(productBase: ProductBase): LaptopSpecs {
  return {
    product_base_id: productBase.product_base_id,
    operating_system: faker.helpers.arrayElement(["Windows 11", "macOS", "Linux"]),
    display: `${faker.number.int({ min: 13, max: 17 })}" ${faker.helpers.arrayElement([
      "IPS",
      "OLED",
      "LED",
    ])}`,
    cpu: faker.helpers.arrayElement(["Intel i5", "Intel i7", "AMD Ryzen 5", "Apple M1"]),
    gpu: faker.helpers.arrayElement(["Intel Iris", "NVIDIA RTX 3060", "AMD Radeon"]),
    connectivity: faker.helpers.arrayElement(["Wi-Fi 6", "Bluetooth 5.0"]),
    battery: `${faker.number.int({ min: 4000, max: 8000 })}mAh`,
    weight: `${faker.number.float({ min: 1.0, max: 3.0, fractionDigits: 1 })}kg`,
  };
}

// =====================
// HeadphoneSpecs
// =====================
export function generateFakeHeadphoneSpecs(productBase: ProductBase): HeadphoneSpecs {
  return {
    product_base_id: productBase.product_base_id,
    headphone_type: faker.helpers.arrayElement(["Over-ear", "In-ear", "On-ear"]),
    connectivity: faker.helpers.arrayElement(["Bluetooth", "Wired", "USB-C"]),
    usage_time: faker.number.int({ min: 4, max: 30 }), // giờ
    sound_technology: faker.helpers.arrayElement(["Noise Cancelling", "Surround", "Stereo"]),
    weight: faker.number.int({ min: 100, max: 400 }), // gram
  };
}

// =====================
// KeyboardSpecs
// =====================
export function generateFakeKeyboardSpecs(productBase: ProductBase): KeyboardSpecs {
  return {
    product_base_id: productBase.product_base_id,
    keyboard_type: faker.helpers.arrayElement(["Mechanical", "Membrane", "Optical"]),
    connectivity: faker.helpers.arrayElement(["Wired", "Bluetooth", "Wireless"]),
    key_count: faker.number.int({ min: 60, max: 108 }),
    backlight: faker.datatype.boolean(),
    size: faker.helpers.arrayElement(["Full-size", "Tenkeyless", "Compact"]),
    weight: faker.number.int({ min: 500, max: 1500 }), // gram
  };
}

// =====================
// Color
// =====================
export function generateFakeColor(colorName?: string, value?: string): Color {
  return {
    color_id: faker.string.uuid(),
    color_name: colorName || faker.color.human(),
    value: value || faker.color.rgb({ casing: "lower" }),
  };
}

// =====================
// Variant
// =====================
export function generateFakeVariant(productBase: ProductBase): Variant {
  return {
    variant_id: faker.string.uuid(),
    product_base_id: productBase.product_base_id,
    stock: faker.number.int({ min: 0, max: 500 }),
    variant_price: productBase.base_price
      ? productBase.base_price + faker.number.int({ min: -50, max: 200 })
      : faker.number.int({ min: 50, max: 2000 }),
  };
}

// =====================
// PhoneVariant
// =====================
export function generateFakePhoneVariant(variant: Variant, color: Color): PhoneVariant {
  return {
    variant_id: variant.variant_id,
    ram: faker.helpers.arrayElement([4, 6, 8, 12, 16]),
    storage: faker.helpers.arrayElement([64, 128, 256, 512, 1024]),
    color_id: color.color_id,
  };
}

// =====================
// LaptopVariant
// =====================
export function generateFakeLaptopVariant(variant: Variant, color: Color): LaptopVariant {
  return {
    variant_id: variant.variant_id,
    ram: faker.helpers.arrayElement([8, 16, 32, 64]),
    storage: faker.helpers.arrayElement(["256GB", "512GB", "1TB", "2TB"]),
    color_id: color.color_id,
  };
}

// =====================
// HeadphoneVariant
// =====================
export function generateFakeHeadphoneVariant(variant: Variant, color: Color): HeadphoneVariant {
  return {
    variant_id: variant.variant_id,
    color_id: color.color_id,
  };
}

// =====================
// KeyboardVariant
// =====================
export function generateFakeKeyboardVariant(variant: Variant, color: Color): KeyboardVariant {
  return {
    variant_id: variant.variant_id,
    switch_type: faker.helpers.arrayElement(["Mechanical", "Membrane", "Optical"]),
    color_id: color.color_id,
  };
}


// =====================
// PromotionType
// =====================
export function generateFakePromotionType(
  name?: string,
  info?: string,
  unit?: string
): PromotionType {
  return {
    promotion_type_id: faker.string.uuid(),
    promotion_type_name: name || faker.helpers.arrayElement(["Discount", "Flash Sale", "Bundle", "Cashback"]),
    promotion_type_info: info || faker.commerce.productDescription(),
    unit: unit || faker.helpers.arrayElement(["%", "$"]),
  };
}

// =====================
// Promotion
// =====================
export function generateFakePromotion(promotionType: PromotionType): Promotion {
  const start = faker.date.future({ years: 0.1 }); // ~1-2 tháng tới
  const end = faker.date.future({ years: 0.2, refDate: start }); // sau start

  return {
    promotion_id: faker.string.uuid(),
    promotion_type: promotionType.promotion_type_id,
    value: faker.number.int({ min: 5, max: 50 }).toString(), // giá trị khuyến mãi
    promotion_info: faker.commerce.productDescription(),
    start_date: start.toISOString().split("T")[0],
    end_date: end.toISOString().split("T")[0],
  };
}

// =====================
// ProductPromotion
// =====================
export function generateFakeProductPromotion(productBase: ProductBase, promotion: Promotion): ProductPromotion {
  return {
    product_base_id: productBase.product_base_id,
    promotion_id: promotion.promotion_id,
  };
}

// =====================
// Hàm tạo Review
// =====================
export function generateFakeReview(variant: Variant): Review {
  return {
    review_id: faker.string.uuid(),
    rating: faker.number.int({ min: 1, max: 5 }),
    feedback: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    variant_id: variant.variant_id, // FK
    customer_name: faker.person.fullName(),
    phone_number: faker.phone.number(),
    email: faker.internet.email(),
  };
}


// =====================
// Tạo Image
// =====================
export function generateFakeImage(productType: "PHONE" | "LAPTOP" | "KEYBOARD" | "HEADPHONE"): ProductImage {
  return {
    image_id: faker.string.uuid(),
    image_caption: faker.lorem.sentence(),
    image_alt: faker.lorem.words(3),
    image_url: faker.image.urlLoremFlickr({ category: productType, width: 600, height: 600 }),
    added_date: new Date().toISOString(),
  };
}

// =====================
// Tạo ProductBaseImage
// =====================
export function generateFakeProductBaseImage(image: ProductImage, productBase: ProductBase): ProductBaseImage {
  return {
    image_id: image.image_id,
    product_base_id: productBase.product_base_id,
  };
}

// =====================
// Tạo VariantImage
// =====================
export function generateFakeVariantImage(image: ProductImage, variant: Variant): VariantImage {
  return {
    image_id: image.image_id,
    variant_id: variant.variant_id,
  };
}


export function generateFakeProduct(productType: "PHONE" | "LAPTOP" | "KEYBOARD" | "HEADPHONE", numOfProduct: number, numberVarriantOfEachProduct: number) {

  const productColors: Color[] = [
    generateFakeColor("Black", "#000000"),
    generateFakeColor("White", "#FFFFFF"),
    generateFakeColor("Blue", "#0000FF"),
    generateFakeColor("Red", "#FF0000"),
    generateFakeColor("Green", "#00FF00"),
    generateFakeColor("Gray", "#808080"),
    generateFakeColor("Gold", "#FFD700"),
    generateFakeColor("Silver", "#C0C0C0"),
    generateFakeColor("Purple", "#800080"),
    generateFakeColor("Pink", "#FFC0CB"),
  ];

  const productBases = Array.from({ length: numOfProduct }, () => generateFakeProductBase(productType))


  const productSpecs = productBases.map((item) => {
    return generateFakePhoneSpecs(item);
  })

  const variantsArray = productBases.map((item) => {
    const variants = Array.from({ length: numberVarriantOfEachProduct }, () => generateFakeVariant(item));
    return variants;
  })

  const infoOfVariantsArray = variantsArray.map((variants) => {
    const variantInfos = variants.map((item) => {
      const randomIndex = Math.floor(Math.random() * productColors.length);
      return generateFakePhoneVariant(item, productColors[randomIndex]);
    })

    return variantInfos;
  })

  const products = productBases.map((base, index) => {
    return {
      ...base,
      specs: {
        ...productSpecs[index],
        product_base_id: undefined,
      },
      variants: variantsArray[index].map((variant, varIdx) => {

        const color = productColors.find(item => infoOfVariantsArray[index][varIdx].color_id === item.color_id);

        const variantInfoWithColor = { ...infoOfVariantsArray[index][varIdx], color_id: undefined, color: color };

        return {
          ...variant,
          product_base_id: undefined,
          ...variantInfoWithColor,
        }
      })
    }

  })

  return products;
}