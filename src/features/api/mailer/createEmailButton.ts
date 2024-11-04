export const createEmailButton = (text : string, link : string) => {
    return  `<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tr><td><table cellspacing=\"0\" cellpadding=\"0\"><tr><td class=”button” bgcolor=\"#390A70\"><a  class=”link” href=\"${link}\" target=\"_blank\">${text}</a></td></tr></table></td></tr></table>`;
}