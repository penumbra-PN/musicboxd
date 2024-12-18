import React, { useState } from "react";

interface AddReviewFormProps {
  songId: string;
  onSubmit: (review: { rating: number; comment: string; songId: string }) => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ songId, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (rating < 1 || rating < 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setError(null);
    onSubmit({ rating, comment, songId });
    setRating(0);
    setComment("");
  };

  return (
    <form className="add-review-form" onSubmit={handleSubmit}>
      <h2>Add a Review</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="rating">Rating (1-5):</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
        />
      </div>
      <div className="form-group">
        <label htmlFor="comment">Comment:</label>
        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={4}></textarea>
      </div>

      <button type="submit" className="submit-button">
        Submit Review
      </button>
    </form>
  );
};

export default AddReviewForm;
