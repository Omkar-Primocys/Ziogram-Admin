import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const AddProductForm = () => {
  const [variants, setVariants] = useState([{ color: '', size: '', type: '' }]);
  const [types, setTypes] = useState([]);

  const handleAddVariant = () => {
    setVariants([...variants, { color: '', size: '', type: '' }]);
  };

  const handleVariantChange = (index, event) => {
    const newVariants = variants.map((variant, i) => {
      if (i === index) {
        return { ...variant, [event.target.name]: event.target.value };
      }
      return variant;
    });
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAddType = () => {
    setTypes([...types, '']);
  };

  const handleTypeChange = (index, event) => {
    const newTypes = types.map((type, i) => {
      if (i === index) {
        return event.target.value;
      }
      return type;
    });
    setTypes(newTypes);
  };

  const handleRemoveType = (index) => {
    setTypes(types.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
    });
    toast.fire({
      icon: 'success',
      title: 'Form submitted successfully',
      padding: '10px 20px',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-200 text-center">Add Product</h2>
      
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Product Thumbnail Image (Max size 2 Mb)</label>
        <div className="relative w-32 h-32 mx-auto mt-2 border rounded-md overflow-hidden">
          <img src="thumbnail-placeholder.png" alt="Product Thumbnail" className="object-cover w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-gray-700 text-white p-1 rounded-full">+</button>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Product Multiple Image (Max size 2 Mb)</label>
        <div className="relative w-full h-32 mt-2 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center">
          <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
          <span className="text-gray-500">Add Product Image</span>
        </div>
        <div className="mt-4 flex space-x-2 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden flex-shrink-0">
              <img src="image-placeholder.png" alt="Product" className="object-cover w-full h-full" />
              <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">x</button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="Product_name" className="block text-gray-700 dark:text-gray-300">Product Name</label>
          <input type="text" id="Product_name" name="Product_name" placeholder="Enter Product Name" className="form-input mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200" required />
        </div>
        <div>
          <label htmlFor="category_name" className="block text-gray-700 dark:text-gray-300">Category Name</label>
          <input type="text" id="category_name" name="category_name" placeholder="Enter Category Name" className="form-input mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200" required />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="original_price" className="block text-gray-700 dark:text-gray-300">Original Price</label>
          <input type="number" id="original_price" name="original_price" placeholder="Enter Original Price" className="form-input mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200" required />
        </div>
        <div>
          <label htmlFor="sale_price" className="block text-gray-700 dark:text-gray-300">Sales Price</label>
          <input type="number" id="sale_price" name="sale_price" placeholder="Enter Sales Price" className="form-input mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200" required />
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Attributes</label>
        {variants.map((variant, index) => (
          <div key={index} className="relative mt-2 p-4 border rounded-md dark:bg-gray-800 dark:text-gray-200 space-y-2">
            <button
              type="button"
              onClick={() => handleRemoveVariant(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={variant.color}
                onChange={(event) => handleVariantChange(index, event)}
                className="form-input mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200"
              />
              <input
                type="text"
                name="size"
                placeholder="Size"
                value={variant.size}
                onChange={(event) => handleVariantChange(index, event)}
                className="form-input mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200"
              />
              <input
                type="text"
                name="type"
                placeholder="Type"
                value={variant.type}
                onChange={(event) => handleVariantChange(index, event)}
                className="form-input mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddVariant}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Attribute
        </button>
      </div>
      
      <div className="flex items-center mt-4">
        <button
          type="button"
          onClick={handleAddType}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Type
        </button>
        {types.map((type, index) => (
          <div key={index} className="relative mt-2 ml-2 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200">
            <input
              type="text"
              value={type}
              onChange={(event) => handleTypeChange(index, event)}
              className="form-input p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200"
            />
            <button
              type="button"
              onClick={() => handleRemoveType(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="Product_desc" className="block text-gray-700 dark:text-gray-300">Product Description</label>
        <textarea id="Product_desc" name="Product_desc" placeholder="Enter Product Description" className="form-input mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200" required></textarea>
      </div>

      <div className="flex items-center mt-4">
        <input type="checkbox" id="agree" className="form-checkbox" required />
        <label htmlFor="agree" className="ml-2 text-gray-700 dark:text-gray-300">I agree to the terms and conditions</label>
      </div>

      <div className="flex justify-center mt-6">
        <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
