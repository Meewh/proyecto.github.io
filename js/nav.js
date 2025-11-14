document.addEventListener("DOMContentLoaded", () => {

  const nav = document.getElementById("navbar");

  nav.innerHTML = `
<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1e7f3] px-10 py-3">
  <div class="flex items-center gap-4 text-[#190d1b]">
    <div class="size-4">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg>
    </div>
    <h2 class="text-[#190d1b] text-lg font-bold leading-tight tracking-[-0.015em]">Purrfect Finds</h2>
  </div>

  <div class="flex flex-1 justify-end gap-8">
    <div class="flex items-center gap-9">
      <a class="text-[#190d1b] text-sm font-medium leading-normal" href="index.html">Inicio</a>
      <a class="text-[#190d1b] text-sm font-medium leading-normal" href="categories.html">Categorías</a>
      <a class="text-[#190d1b] text-sm font-medium leading-normal" href="#">Ventas</a>
      <a class="text-[#190d1b] text-sm font-medium leading-normal" href="#">Contáctenos/Dónde estamos</a>
    </div>

    <div class="flex gap-2">

      <!-- Carrito -->
      <button
        class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1e7f3] text-[#190d1b] text-sm font-bold leading-normal tracking-[0.015em]"
      >
        <span class="truncate">Carrito: <span id="cart-count">0</span></span>
      </button>

      <!-- Dark mode -->
      <button
        id="darkToggle"
        class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f1e7f3] text-[#190d1b] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
      >
        <div class="text-[#190d1b]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23Z"
            ></path>
          </svg>
        </div>
      </button>

      <!-- Usuario -->
      <button
        id="userBtn"
        class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f1e7f3] text-[#190d1b] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
      >
        <div class="text-[#190d1b]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M160,40a32,32,0,1,0-32,32A32,32,0,0,0,160,40ZM128,56a16,16,0,1,1,16-16A16,16,0,0,1,128,56ZM231.5,87.71A19.62,19.62,0,0,0,212,72H44a20,20,0,0,0-8.38,38.16l.13,0,50.75,22.35-21,79.72A20,20,0,0,0,102,228.8l26-44.87,26,44.87a20,20,0,0,0,36.4-16.52l-21-79.72,50.75-22.35.13,0A19.64,19.64,0,0,0,231.5,87.71Z"
            ></path>
          </svg>
        </div>
      </button>
    </div>

    <!-- Avatar usuario -->
    <div
      class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
      id="userAvatar"
      style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfvUqXDrJ1PWqRkx7AmdY_IXMbZk2GuValqe9eYhNfdxneatWSwJKNgrgzB4kvRD_RRkTMEyvPH93bXIrd2y7Zm8ivRkKagwRMZMZkKubtEmxrfEXMTDP_DR8BSs2ydc5OnZ3_B7gptSMqoQT3guvlIbLw0PULU8c9hu7KHNCG_fpS0epChRq7pDd2CRyHIAU0_f5z6b02jPMuThkVtz55qXshvf1WBmiRL4bCsmle4zwn2vSNvtysbggJJec3Iyrmx2f-SNPUz9Ze");'
    ></div>
  </div>
</header>
  `;

  // ========== CARRITO ==========
  const productos = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = productos.length;

});
