import { useState } from "react";

import StarRating from "../../../components/common/StarRating";
import useCreateReview from "../hooks/useCreateReview";

const ReviewForm = ({ order, product, customerName }) => {
  const createReview = useCreateReview();

  const [form, setForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  const submit = () => {
    createReview.mutate({
      order,
      product,
      customerName,
      ...form,
    });
  };

  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold">Leave a Review</h2>

      <StarRating
        interactive
        rating={form.rating}
        onChange={(rating) =>
          setForm({
            ...form,
            rating,
          })
        }
      />

      <input
        className="mt-5 w-full rounded-lg border p-3"
        placeholder="Review title"
        value={form.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value,
          })
        }
      />

      <textarea
        rows={5}
        className="mt-4 w-full rounded-lg border p-3"
        placeholder="Tell us what you think..."
        value={form.comment}
        onChange={(e) =>
          setForm({
            ...form,
            comment: e.target.value,
          })
        }
      />

      <button
        onClick={submit}
        className="mt-5 rounded-lg bg-black px-6 py-3 text-white"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewForm;
