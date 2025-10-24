'use client'

import { useState } from "react";
import { CustomModal } from "../modal/custom-modal";
import { ReviewForm } from "./review-form";

interface props {
    orderId: string;
    variantId: string;
    productName: string;
}

export default function ReviewButton({ orderId, variantId, productName }: props) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <button
                type="button"
                onClick={() => { setIsModalOpen(true) }}
                className="border border-blue-500 text-blue-500 rounded-md px-1"
            >
                Viết đánh giá
            </button>
            <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ReviewForm
                    orderId={orderId}
                    variantId={variantId}
                    productName={productName}
                />
            </CustomModal>
        </div>
    );
}