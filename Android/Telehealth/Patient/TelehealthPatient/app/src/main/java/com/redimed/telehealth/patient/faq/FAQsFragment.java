package com.redimed.telehealth.patient.faq;

import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;

import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import android.webkit.WebView;

import android.widget.Button;
import android.widget.LinearLayout;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class FAQsFragment extends Fragment implements IFAQsView {

    private Bundle bundle;
    private Context context;
    private IFAQsPresenter ifaqsPresenter;

    @Bind(R.id.webFAQs)
    WebView webViewFAQs;
    @Bind(R.id.layoutBack)
    LinearLayout layoutBack;

    public FAQsFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_faqs, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);

        ifaqsPresenter = new FAQsPresenter(this, context, getActivity());

        //init Bundle
        getDataBundle();

        layoutBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String page = bundle.getString("msg");
                assert page != null;
                if (page.equalsIgnoreCase("ConfirmFAQs")) {
                    ifaqsPresenter.backToHome(true);
                } else
                    ifaqsPresenter.backToHome(false);
            }
        });
        return v;
    }

    //init Bundle
    private void getDataBundle() {
        bundle = getArguments();
        if (bundle != null) {
            ifaqsPresenter.contentFAQs(bundle);
        }
    }

    @Override
    public void onViewPage(String url) {
        webViewFAQs.setBackgroundColor(Color.TRANSPARENT);
        webViewFAQs.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);
        webViewFAQs.loadUrl(url);
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().requestFocus();
        getView().setFocusableInTouchMode(true);
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ifaqsPresenter.backToHome(false);
                    return true;
                }
                return false;
            }
        });
    }
}
