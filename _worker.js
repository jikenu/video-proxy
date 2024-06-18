// 反代目标网站ipv6.google.com.hk
const upstreamm = 'hanime1.me'
const upstreamm_v4 = 'hanime1.me'
//www.google.com.hk
// 访问区域黑名单（按需设置）.
const blocked_region = []

//资源重定向
const replace_dict = {
  $upstreamm: '$custom_domain',
  'hanime1.me/': '/', //填入你的子域名
//  'vdownload.hembed.com': 'video.mycf2hj.filegear-sg.me'
}

addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})

async function fetch(request) {
  const region = request.headers.get('cf-ipcountry').toUpperCase()

  let response = null
  let url = new URL(request.url)
  let url_host = url.host

  if (url.protocol == 'http:') {
    url.protocol = 'https:'
    response = Response.redirect(url.href)
    return response
  }

  //检查是否为图片搜索
  // var key = url.href
  // var ikey1 = 'tbm=isch'
  // var ikey2 = '/img'
  // if ((key.search(ikey1) == -1) && (key.search(ikey2) == -1)) {
  //   var upstream_domain = upstream
  // } else {
  //   var upstream_domain = upstream_v4
  // }

  //url.host = upstreamm_domain

  // if (blocked_region.includes(region)) {
  //   response = new Response(
  //     'Access denied: PagesProxy is not available in your region yet.',
  //     {
  //       status: 403,
  //     }
  //   )
  // } else {
    let method = request.method
    let request_headers = request.headers
    let new_request_headers = new Headers(request_headers)

    new_request_headers.set('Host', upstreamm_domain)
    new_request_headers.set('Referer', url.href)

    let original_response = await fetch(url.href, {
      method: method,
      headers: new_request_headers,
    })

    let original_response_clone = original_response.clone()
    let original_text = null
    let response_headers = original_response.headers
    let new_response_headers = new Headers(response_headers)
    let status = original_response.status

    // new_response_headers.set('cache-control', 'public, max-age=14400')
    // new_response_headers.set('access-control-allow-origin', '*')
    // new_response_headers.set('access-control-allow-credentials', true)
    // new_response_headers.delete('content-security-policy')
    // new_response_headers.delete('content-security-policy-report-only')
    // new_response_headers.delete('clear-site-data')

    const content_type = new_response_headers.get('content-type')
    if (content_type.includes('text/html') && content_type.includes('UTF-8')) {
      // && content_type.includes('UTF-8')
      original_text = await replace_response_texts(
        original_response_clone,
        upstreamm_domain,
        url_host
      )
    } else {
      original_text = original_response_clone.body
    }

    response = new Response(original_text, {
      status,
      headers: new_response_headers,
    })
  // }
  return response
}

async function replace_response_texts(response, upstreamm_domain, host_name) {
  let text = await response.text()

  var i, j
  for (i in replace_dict) {
    j = replace_dict[i]
    if (i == '$upstreamm') {
      i = upstreamm_domain
    } else if (i == '$custom_domain') {
      i = host_name
    }

    if (j == '$upstreamm') {
      j = upstreamm_domain
    } else if (j == '$custom_domain') {
      j = host_name
    }

    let re = new RegExp(i, 'g')
    text = text.replace(re, j)
  }

  return text
}

export default {
  fetch
}