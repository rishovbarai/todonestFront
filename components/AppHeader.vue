<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo">
        <img :src="logoUrl" alt="ASU Logo" class="desktop-logo" />
        <img :src="mobileLogoUrl" alt="ASU Logo" class="mobile-logo" />
      </div>
      <div class="header-title">
        <h1>Todo List</h1>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import asuLogo from '~/assets/images/asu.png';
import asuMobileLogo from '~/assets/images/ASU-mobile-logo.png';

const logoUrl = asuLogo;
const mobileLogoUrl = asuMobileLogo;
</script>

<style scoped lang="scss">
.app-header {
  width: 1280px;
  height: 120px;
  background: #FFFFFF;
  border-bottom: 1px solid #E8E8E8;
  box-sizing: border-box;
}

.header-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px 85px;
  gap: 16px;
  width: 1280px;
  height: 120px;
  box-sizing: border-box;
}

.logo {
  width: 93px;
  height: 72px;
  flex: none;
  order: 0;
  flex-grow: 0;
  
  .mobile-logo {
    display: none;
  }
  
  .desktop-logo {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.header-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 677px;
  height: 32px;
  flex: none;
  order: 1;
  flex-grow: 0;

  h1 {
    width: 677px;
    height: 32px;
    font-family: 'Arial';
    font-style: normal;
    font-weight: 700;
    font-size: 36px;
    line-height: 32px;
    letter-spacing: -0.035em;
    color: #191919;
    margin: 0;
  }
}

// Mobile styles
@media (max-width: 768px) {
  .app-header {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 32px;
    gap: 10px;
    position: relative;
    width: 100%;
    max-width: 375px;
    height: 112px;
    margin: 0 auto;
    background: #FFFFFF;
    border-bottom: 1px solid #E8E8E8;
  }

  .header-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px;
    width: 100%;
    max-width: 311px;
    height: 64px;
    flex: none;
    order: 0;
    flex-grow: 0;
    box-sizing: border-box;
  }

  .logo {
    width: 177px;
    max-width: 100%;
    height: 32px;
    flex: none;
    order: 0;
    flex-grow: 0;
    
    .desktop-logo {
      display: none;
    }
    
    .mobile-logo {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .header-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 0px;
    width: auto;
    max-width: 294px;
    height: 16px;
    flex: none;
    order: 1;
    flex-grow: 0;

    h1 {
      width: auto;
      max-width: 294px;
      height: 16px;
      font-family: 'Arial';
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 16px;
      flex: none;
      order: 0;
      flex-grow: 0;
      color: #000000;
      margin: 0;
    }
  }
}
</style>

