package patient.telehealth.redimed.workinjury.faq.presenter;

import android.os.Bundle;
import patient.telehealth.redimed.workinjury.faq.view.IFAQsView;
import patient.telehealth.redimed.workinjury.utils.Key;


/**
 * Created by Fox on 1/14/2016.
 */
public class FAQsPresenter implements IFAQsPresenter {

    private IFAQsView ifaQsView;

    public FAQsPresenter(IFAQsView ifaQsView) {
        this.ifaQsView = ifaQsView;
    }

    @Override
    public void contentFAQs(Bundle bundle) {
        String url = Key.FAQ.fileFAQ;
        String title = null;
        if (bundle != null) {
            String page = bundle.getString(Key.FAQ.msg);
            assert page != null;
            switch (page) {
                case Key.FAQ.titleAboutUs:
                    url = Key.FAQ.fileAboutUs;
                    title = Key.FAQ.titleAboutUs;
                    break;
                case Key.FAQ.titleFAQs:
                    url = Key.FAQ.fileFAQ;
                    title = Key.FAQ.titleFAQs;
                    break;
                case Key.FAQ.titleService:
                    url = Key.FAQ.fileOther;
                    title = Key.FAQ.titleService;
                    break;
                case Key.FAQ.titleConfirmFAQs:
                    url = Key.FAQ.fileFAQ;
                    title = Key.FAQ.titleConfirmFAQs;
                    break;
                default:
                    break;
            }
        }
        ifaQsView.onViewPage(url, title);
    }
}
