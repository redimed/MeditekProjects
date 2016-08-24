package patient.telehealth.redimed.workinjury.faq;

import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.faq.presenter.FAQsPresenter;
import patient.telehealth.redimed.workinjury.faq.presenter.IFAQsPresenter;
import patient.telehealth.redimed.workinjury.faq.view.IFAQsView;

/**
 * A simple {@link Fragment} subclass.
 */
public class FAQsFragment extends Fragment implements IFAQsView {

    private IFAQsPresenter ifaQsPresenter;
    private MyApplication application;
    private String title;

    @Bind(R.id.webFAQs) WebView webViewFAQs;


    public FAQsFragment() {
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ifaQsPresenter = new FAQsPresenter(this);
        application = MyApplication.getInstance();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_faqs, container, false);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, view);
        ifaQsPresenter.contentFAQs(getArguments());
        application.createTooBarTitle(view, title);
        return view;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.BackFragment(null,null);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onViewPage(String url, String title) {
        webViewFAQs.setBackgroundColor(Color.TRANSPARENT);
        webViewFAQs.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);
        webViewFAQs.loadUrl(url);
        this.title = title;
    }

    @Override
    public void Back(String page) {

    }
}
