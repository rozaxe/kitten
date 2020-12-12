/* eslint-disable */
if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_USE_ANALYTICS === 'true') {
    (function(f, a, t, h, o, m){
        a[h]=a[h]||function(){
            (a[h].q=a[h].q||[]).push(arguments)
        };
        o=f.createElement('script'),
        m=f.getElementsByTagName('script')[0];
        o.async=1; o.src=t; o.id='fathom-script';
        m.parentNode.insertBefore(o,m)
    })(document, window, '//fathom.topaze.ovh/tracker.js', 'fathom');
    fathom('set', 'siteId', 'YGAYW');
    fathom('trackPageview');
}
