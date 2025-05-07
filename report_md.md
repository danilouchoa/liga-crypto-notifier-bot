# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).

## Summary of Alerts

| Risk Level    | Number of Alerts |
| ------------- | ---------------- |
| High          | 0                |
| Medium        | 2                |
| Low           | 2                |
| Informational | 1                |

## Alerts

| Name                                                      | Risk Level    | Number of Instances |
| --------------------------------------------------------- | ------------- | ------------------- |
| CSP: Failure to Define Directive with No Fallback         | Medium        | 1                   |
| CSP: style-src unsafe-inline                              | Medium        | 1                   |
| Insufficient Site Isolation Against Spectre Vulnerability | Low           | 1                   |
| Permissions Policy Header Not Set                         | Low           | 4                   |
| Storable and Cacheable Content                            | Informational | 4                   |

## Alert Detail

### [ CSP: Failure to Define Directive with No Fallback ](https://www.zaproxy.org/docs/alerts/10055/)

##### Medium (High)

### Description

The Content Security Policy fails to define one of the directives that has no fallback. Missing/excluding them is the same as allowing anything.

- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/
  - Method: `GET`
  - Parameter: `Content-Security-Policy`
  - Attack: ``
  - Evidence: `default-src 'none'`
  - Other Info: `The directive(s): frame-ancestors, form-action is/are among the directives that do not fallback to default-src.`

Instances: 1

### Solution

Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.

### Reference

- [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
- [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
- [ https://content-security-policy.com/ ](https://content-security-policy.com/)
- [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
- [ https://developers.google.com/web/fundamentals/security/csp#policy_applies_to_a_wide_variety_of_resources ](https://developers.google.com/web/fundamentals/security/csp#policy_applies_to_a_wide_variety_of_resources)

#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)

#### WASC Id: 15

#### Source ID: 3

### [ CSP: style-src unsafe-inline ](https://www.zaproxy.org/docs/alerts/10055/)

##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/health
  - Method: `GET`
  - Parameter: `Content-Security-Policy`
  - Attack: ``
  - Evidence: `default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests`
  - Other Info: `style-src includes unsafe-inline.`

Instances: 1

### Solution

Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.

### Reference

- [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
- [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
- [ https://content-security-policy.com/ ](https://content-security-policy.com/)
- [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
- [ https://developers.google.com/web/fundamentals/security/csp#policy_applies_to_a_wide_variety_of_resources ](https://developers.google.com/web/fundamentals/security/csp#policy_applies_to_a_wide_variety_of_resources)

#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)

#### WASC Id: 15

#### Source ID: 3

### [ Insufficient Site Isolation Against Spectre Vulnerability ](https://www.zaproxy.org/docs/alerts/90004/)

##### Low (Medium)

### Description

Cross-Origin-Embedder-Policy header is a response header that prevents a document from loading any cross-origin resources that don't explicitly grant the document permission (using CORP or CORS).

- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/health
  - Method: `GET`
  - Parameter: `Cross-Origin-Embedder-Policy`
  - Attack: ``
  - Evidence: ``
  - Other Info: ``

Instances: 1

### Solution

Ensure that the application/web server sets the Cross-Origin-Embedder-Policy header appropriately, and that it sets the Cross-Origin-Embedder-Policy header to 'require-corp' for documents.
If possible, ensure that the end user uses a standards-compliant and modern web browser that supports the Cross-Origin-Embedder-Policy header (https://caniuse.com/mdn-http_headers_cross-origin-embedder-policy).

### Reference

- [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)

#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)

#### WASC Id: 14

#### Source ID: 3

### [ Permissions Policy Header Not Set ](https://www.zaproxy.org/docs/alerts/10063/)

##### Low (Medium)

### Description

Permissions Policy Header is an added layer of security that helps to restrict from unauthorized access or usage of browser/client features by web resources. This policy ensures the user privacy by limiting or specifying the features of the browsers can be used by the web resources. Permissions Policy provides a set of standard HTTP headers that allow website owners to limit which features of browsers can be used by the page such as camera, microphone, location, full screen etc.

- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/
  - Method: `GET`
  - Parameter: ``
  - Attack: ``
  - Evidence: ``
  - Other Info: ``
- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/health
  - Method: `GET`
  - Parameter: ``
  - Attack: ``
  - Evidence: ``
  - Other Info: ``
- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/robots.txt
  - Method: `GET`
  - Parameter: ``
  - Attack: ``
  - Evidence: ``
  - Other Info: ``
- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/sitemap.xml
  - Method: `GET`
  - Parameter: ``
  - Attack: ``
  - Evidence: ``
  - Other Info: ``

Instances: 4

### Solution

Ensure that your web server, application server, load balancer, etc. is configured to set the Permissions-Policy header.

### Reference

- [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy)
- [ https://developer.chrome.com/blog/feature-policy/ ](https://developer.chrome.com/blog/feature-policy/)
- [ https://scotthelme.co.uk/a-new-security-header-feature-policy/ ](https://scotthelme.co.uk/a-new-security-header-feature-policy/)
- [ https://w3c.github.io/webappsec-feature-policy/ ](https://w3c.github.io/webappsec-feature-policy/)
- [ https://www.smashingmagazine.com/2018/12/feature-policy/ ](https://www.smashingmagazine.com/2018/12/feature-policy/)

#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)

#### WASC Id: 15

#### Source ID: 3

### [ Storable and Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)

##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, and may be retrieved directly from the cache, rather than from the origin server by the caching servers, in response to similar requests from other users. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where "shared" caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/
  - Method: `GET`
  - Parameter: ``
  - Attack: ``
  - Evidence: ``
  - Other Info: `In the absence of an explicitly specified caching lifetime directive in the response, a liberal lifetime heuristic of 1 year was assumed. This is permitted by rfc7234.`
- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/health
  - Method: `GET`
  - Parameter: ``
  - Attack: ``
  - Evidence: ``
  - Other Info: `In the absence of an explicitly specified caching lifetime directive in the response, a liberal lifetime heuristic of 1 year was assumed. This is permitted by rfc7234.`
- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/robots.txt
  - Method: `GET`
  - Parameter: ``
  - Attack: ``
  - Evidence: ``
  - Other Info: `In the absence of an explicitly specified caching lifetime directive in the response, a liberal lifetime heuristic of 1 year was assumed. This is permitted by rfc7234.`
- URL: http://automacao-liga-env-8f342f.eba-myaib4bz.us-east-1.elasticbeanstalk.com/sitemap.xml
  - Method: `GET`
  - Parameter: ``
  - Attack: ``
  - Evidence: ``
  - Other Info: `In the absence of an explicitly specified caching lifetime directive in the response, a liberal lifetime heuristic of 1 year was assumed. This is permitted by rfc7234.`

Instances: 4

### Solution

Validate that the response does not contain sensitive, personal or user-specific information. If it does, consider the use of the following HTTP response headers, to limit, or prevent the content being stored and retrieved from the cache by another user:
Cache-Control: no-cache, no-store, must-revalidate, private
Pragma: no-cache
Expires: 0
This configuration directs both HTTP 1.0 and HTTP 1.1 compliant caching servers to not store the response, and to not retrieve the response (without validation) from the cache, in response to a similar request.

### Reference

- [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
- [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
- [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)

#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)

#### WASC Id: 13

#### Source ID: 3
