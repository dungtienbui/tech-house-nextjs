import { faker } from "@faker-js/faker";
import { Account, Employee, Customer, ProductBase, Color, Variant, PromotionType, Promotion, ProductPromotion, Review, ProductImage, ProductBaseImage, VariantImage, HeadphoneSpec, KeyboardSpec, LaptopSpec, PhoneSpec, ProductBrand } from "../definations/database-table-definations";
import { ProductType, SpecResults } from "../definations/types";

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
export function generateFakeProductBase(productType: ProductType, productBrand: ProductBrand): ProductBase {
  return {
    product_base_id: faker.string.uuid(),
    product_name: `${productType} - ${faker.commerce.productName()}`,
    brand_id: productBrand.brand_id,
    product_type: productType,
    description: faker.commerce.productDescription(),
    base_price: faker.number.int({ min: 100, max: 2000 }),
  };
}

// =====================
// ProductSpec
// =====================
export function generateSpecs(productType: ProductType, productBases: ProductBase[]): SpecResults {
  switch (productType) {
    case "phone":
      return productBases.map(generateFakePhoneSpec);
    case "laptop":
      return productBases.map(generateFakeLaptopSpec);
    case "keyboard":
      return productBases.map(generateFakeKeyboardSpec);
    case "headphone":
      return productBases.map(generateFakeHeadphoneSpec);
    default:
      return [];
  }
}


function generateFakePhoneSpec(productBase: ProductBase): PhoneSpec {
  return {
    product_base_id: productBase.product_base_id,
    weight: faker.number.int({ min: 120, max: 250 }), // g
    screen_size: faker.helpers.arrayElement([5.5, 6.1, 6.5, 6.7]),
    display_tech: faker.helpers.arrayElement(["OLED", "AMOLED", "IPS LCD"]),
    chipset: faker.helpers.arrayElement(["Snapdragon 8 Gen 2", "Apple A17 Pro", "Dimensity 9200"]),
    os: faker.helpers.arrayElement(["Android 14", "iOS 17"]),
    battery: faker.number.int({ min: 3000, max: 6000 }),
    camera: faker.helpers.arrayElement(["12MP", "50MP", "108MP"]),
    material: faker.helpers.arrayElement(["Nhựa", "Nhôm", "Kính"]),
    connectivity: faker.helpers.arrayElement(["Wi-Fi 6E, 5G", "Wi-Fi 6, 4G", "Bluetooth 5.3"]),
  };
}

function generateFakeLaptopSpec(productBase: ProductBase): LaptopSpec {
  return {
    product_base_id: productBase.product_base_id,
    weight: faker.number.int({ min: 900, max: 2500 }), // g
    screen_size: faker.helpers.arrayElement([13.3, 14.0, 15.6, 16.0]),
    display_tech: faker.helpers.arrayElement(["IPS", "OLED", "MiniLED"]),
    chipset: faker.helpers.arrayElement(["Intel i5-1340P", "Intel i7-1360P", "Ryzen 7 7840U", "Apple M2"]),
    os: faker.helpers.arrayElement(["Windows 11", "macOS 14"]),
    battery: faker.number.int({ min: 4000, max: 9000 }),
    material: faker.helpers.arrayElement(["Nhôm", "Magie", "Nhựa"]),
    connectivity: faker.helpers.arrayElement(["Wi-Fi 6E", "Wi-Fi 7"]),
    gpu_card: faker.helpers.arrayElement(["RTX 3050", "RTX 4060", "Iris Xe", "Integrated"]),
  };
}

function generateFakeKeyboardSpec(productBase: ProductBase): KeyboardSpec {
  return {
    product_base_id: productBase.product_base_id,
    weight: faker.number.int({ min: 400, max: 1500 }),
    material: faker.helpers.arrayElement(["Nhựa", "Nhôm"]),
    connectivity: faker.helpers.arrayElement(["USB", "Bluetooth 5.0", "2.4GHz Wireless"]),
    number_of_keys: faker.helpers.arrayElement([61, 87, 104]),
    usage_time: faker.number.int({ min: 20, max: 200 }), // giờ pin
  };
}

function generateFakeHeadphoneSpec(productBase: ProductBase): HeadphoneSpec {
  return {
    product_base_id: productBase.product_base_id,
    weight: faker.number.int({ min: 150, max: 400 }),
    connectivity: faker.helpers.arrayElement(["Bluetooth 5.2", "Bluetooth 5.3", "USB-C"]),
    usage_time: faker.number.int({ min: 10, max: 40 }),
    compatibility: faker.helpers.arrayElement([
      "iPhone, Android",
      "Windows, Mac",
      "Android, Laptop, Tablet",
    ]),
  };
}

// =====================
// Variant
// =====================
export function generateFakeVariant(
  productBase: ProductBase,
  productImage: ProductImage,
  productColor: Color,
): Variant {
  return {
    variant_id: faker.string.uuid(),
    product_base_id: productBase.product_base_id,
    stock: faker.number.int({ min: 0, max: 500 }),
    variant_price: productBase.base_price
      ? productBase.base_price + faker.number.int({ min: -50, max: 200 })
      : faker.number.int({ min: 50, max: 2000 }),
    preview_id: productImage.image_id,
    is_promoting: faker.datatype.boolean(),
    color_id: productColor.color_id,
    ram: (productBase.product_type === "laptop" || productBase.product_type === "phone") ? faker.helpers.arrayElement([8, 16, 32]) : null,
    storage: (productBase.product_type === "laptop" || productBase.product_type === "phone") ? faker.helpers.arrayElement([256, 512, 1024]) : null,
    switch_type: productBase.product_type === "keyboard" ? faker.helpers.arrayElement(["Red", "Blue", "Brown"]) : null,
    date_added: new Date().toISOString(),
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
export function generateFakeImagePlacehold(size?: { width: number, height: number }): ProductImage {

  const str = `${faker.lorem.words({ min: 3, max: 10 })}\\n${faker.lorem.words(3)}\\n${faker.lorem.words({ min: 3, max: 10 })}`.replaceAll(" ", "+");
  const image_url = `https://placehold.co/${size?.width ?? "600"}x${size?.height ?? "600"}.png?text=${str}`;

  return {
    image_id: faker.string.uuid(),
    image_caption: faker.lorem.sentence(),
    image_alt: faker.lorem.words(3),
    image_url: image_url,
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