'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function Analytics() {
  // 優先使用環境變數，如果沒有則使用預設值
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-E3R4L3Z9SR'
  
  // 配置跨域追踪的域名列表（主站和子站）
  const domains = [
    'waynspace.com',
    'camera-float-ntu-web.waynspace.com',
    'photos.waynspace.com',
  ]

  const pathname = usePathname()

  // 當路由變化時發送頁面瀏覽事件
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_ID, {
        page_path: pathname,
        page_location: window.location.href,
      })
    }
  }, [pathname, GA_ID])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            page_location: window.location.href,
            send_page_view: true,
            cookie_domain: 'auto',
            cookie_flags: 'SameSite=None;Secure',
            allow_google_signals: true,
            allow_ad_personalization_signals: true,
            linker: {
              domains: ${JSON.stringify(domains)}
            }
          });
        `}
      </Script>
    </>
  )
}
