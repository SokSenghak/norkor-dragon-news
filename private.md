
## create xml folder and create file network_security_config.xml for api no https.

<?xml version="1.0" encoding="utf-8"?>
<network-security-config>

    <!-- Allow all HTTP traffic globally -->
    <base-config cleartextTrafficPermitted="true" />

    <!-- nkdnews.com -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">nkdnews.com</domain>
        <domain includeSubdomains="true">nkdnews.com:8080</domain>
    </domain-config>

    <!-- FastAPI server -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">128.199.154.112</domain>
        <domain includeSubdomains="true">128.199.154.112:9090</domain>
    </domain-config>

    <!-- NodeJS API server -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">159.223.75.243</domain>
    </domain-config>

</network-security-config>

## Add this in AndroidManifest.xml in application tag
android:usesCleartextTraffic="true" android:networkSecurityConfig="@xml/network_security_config"