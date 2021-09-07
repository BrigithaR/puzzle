<h1>CODE REVIEW BASED ON THE EXISTING CODE</h1>
<p>
  The following code smells or problems were found in the source code:
  <ul><li>Images do not have explicit width and height<br>
          Explicit width and height can be set on image elements to reduce layout shifts and improve CLS (Cumulative layout shift).
      </li> 
      <li>Document do not have a meta description<br>
          Meta descriptions may be included in search results to concisely summarize page content.
      </li>
      <li>Usage of double equals in if condition<br>
          Rather than using double or triple equals we can just use if(variable), this gets validated of the value is true.
    </li>
          
  </ul>
</p>
<p>
  Given below are the suggestions to improve the code:
  <ul>
    <li>Ensure text remains visible during webfont load<br>
        Leverage the font-display CSS feature to ensure text is user-visible while webfonts are loading
    </li>
    <li>Preload key requests<br>
        Consider using link rel=preload to prioritize fetching resources that are currently requested later in page load
    </li>
    <li>Avoid large layout shifts<br>
         These DOM elements contribute most to the CLS of the page
    </li>
  </ul>
</p>
<div>
<b> LIGHTHOUSE ACCESSIBILITY REPORT </b>
<p>
  The issues that were detected while using lighthouse tool to test accessibility are:
  <ul>
    <li> Buttons do not have an accessibile name <br>
         When a button doesn't have an accessible name, screen readers announce it as "button" making it unusable for <br>
         users who rely on screen readers.
    </li>
    <li> Background and foreground colors do not have sufficient contrast ratio<br>
         Low-contrast text is difficult or impossible for many users to read<br>
      <ul><li> Text that is 18pt, or 14pt and bold, needs a contrast ratio of 3:1</li>
        <li> All other text needs a contrast ratio of 4.5:1</li>
      </ul>
    </li>
  <ul>
    </p>
    </div>
 <b> MANUAL ACCESSIBILITY TESTING </b>
  <p>
      The following accessibility issues were found while manually testing the code:
      <ul>
        <li> Landmarks <br>
             Checked for ARIA Landmark role attributes in the page's source code<br>
             No such roles were found.
        </li>
        <li> Image Description <br>
             Checked for alt attribute of images<br>
             Images did not have alternative texts.
        </li>
        <li> Interactive Content Description <br>
             Checked the presence and clarity of the description of the interactive elements (buttons).<br>
             There were no descriptions or they were incomprehensible
        </li>
    </ul>
  </p>
    
