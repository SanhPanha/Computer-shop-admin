'use client'
import { CartProductType,  ProductType } from "@/lib/constans";
import { Card } from "flowbite-react";
import { useRouter } from "next/navigation";
const getData=async()=>{	
  const data=await fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/?page=1&page_size=4`)
  const respone=await data.json();
  return respone.results;
}
export default async function CardDetail(pros:CartProductType) {
  const router=useRouter();
  const items=await getData();
  return (
    <main className="container mx-auto mt-3 ">
      <div className="grid lg:grid-cols-2">
        <div className="max-w-[500px] mx-auto">
          <img src={pros?.image||"placeHolderImage"} alt="" className="max-w-[500px] "/>
        </div>
        <div className="leading-[40px]">
          <p>Home / Men / DNK Blue Shoes</p>
          <p className="font-semibold">Men</p>
          <p className="text-[30px]">{pros.name}</p>
          <p className="text-[20px] font-semibold">{pros.price} $ +Free Shipping</p>	
          <p className="leading-">Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris in erat justo. Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit sed.</p>
          <div>
            
<form>
    <label className="font-semibold">Choose quantity:</label>
    <div className="relative flex items-center max-w-[8rem]">
        <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
            <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
            </svg>
        </button>
        <input type="text" id="quantity-input" data-input-counter data-input-counter-min="1" data-input-counter-max="50" aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="999" value="5" required />
        <button type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
            <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
            </svg>
        </button>
    </div>
    <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please select a 5 digit number from 0 to 9.</p>
</form>
          </div>
          <button className="mt-4 bg-yellow-500 text-white px-5 py-1 rounded-lg">Add to Cart</button>
        </div>
      </div>
      <div className="mt-[35px] leading-4">
      <hr className="bg-green-500 border-none h-[1px] w-[90px]" />
      <p className="text-black font-semibold">Descriptions</p>
     <p className="text-gray-500 font-semibold text-base mt-4">Unwind in comfort without compromising style with our Relaxed Fit Joggers. Crafted for both leisure and an active lifestyle, these joggers redefine casual chic. The soft, breathable fabric and relaxed silhouette provide an unmatched level of ease, making them perfect for lounging at home or stepping out for an on-the-go adventure. Versatile and effortlessly cool, our Relaxed Fit Joggers seamlessly combine comfort and fashion, ensuring you feel relaxed and look effortlessly stylish no matter the occasion.</p>
      </div>
      <p className="mt-4 text-[24px] text-black font-semibold ">Suggestion Products</p>
      <div className="mt-[30px] grid sm:grid-cols-1  md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-[24px]">
        {items.map((item:ProductType,key:any)=>(
           <Card
           key={key}
           className="container mx-auto h-[400px] w-[300px] cursor-pointer"
           renderImage={()=>(<img className='w-[310px] h-[400px] overflow-hidden object-fit' src={item?.image||"placeHolderImage"} alt={item.name} onClick={()=>router.push(`/service/${item.slug}`)} />
           )}  
         >
           <h5 className="mt-[-40px] text-xl font-bold tracking-tight text-gray-900 dark:text-white">
             {item?.name||"Product Name"}
           </h5>
           <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
             {item?.desc||"Product Description"}
           </p>
         
           <div className="flex items-center justify-between">
             <span className="text-xl font-bold text-gray-900 dark:text-white">${item.price}</span>
             <a
               href="#"
               className="rounded-lg bg-yellow-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
             >
               Add to cart
             </a>
           </div>
         </Card>
        ))}
      </div>
    </main>
  );
}