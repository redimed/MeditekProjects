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

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class FAQsFragment extends Fragment implements IFAQsView, View.OnClickListener {

    private Context context;
    private IFAQsPresenter ifaqsPresenter;

    @Bind(R.id.webFAQs)
    WebView webViewFAQs;
    @Bind(R.id.btnBack)
    Button btnBack;

    public FAQsFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_faqs, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);

        ifaqsPresenter = new FAQsPresenter(this, context) ;
        btnBack.setOnClickListener(this);

        //init Bundle
        getDataBundle();

        return v;
    }

    //init Bundle
    private void getDataBundle(){
        Bundle bundle = getArguments();
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
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnBack:
                ifaqsPresenter.backToHome(getActivity());
                break;
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ifaqsPresenter.backToHome(getActivity());
                    return true;
                }
                return false;
            }
        });
    }
}
