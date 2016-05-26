package com.redimed.telehealth.patient.faq;

import android.content.Context;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.app.Fragment;

import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import android.webkit.WebView;

import android.widget.LinearLayout;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.faq.presenter.FAQsPresenter;
import com.redimed.telehealth.patient.faq.presenter.IFAQsPresenter;
import com.redimed.telehealth.patient.faq.view.IFAQsView;
import com.redimed.telehealth.patient.home.HomeFragment;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class FAQsFragment extends Fragment implements IFAQsView {

    private Bundle bundle;
    private Context context;
    private IFAQsPresenter ifaqsPresenter;

    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.webFAQs)
    WebView webViewFAQs;


    public FAQsFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_faqs, container, false);
        setHasOptionsMenu(true);
        context = v.getContext();
        ButterKnife.bind(this, v);

        //init
        init();

        return v;
    }

    //init
    private void init() {
        bundle = getArguments();
        ifaqsPresenter = new FAQsPresenter(this, context, getActivity());

        if (bundle != null) {
            ifaqsPresenter.contentFAQs(bundle);
        }

        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        ActionBar actionBar = appCompatActivity.getSupportActionBar();

        if (actionBar != null) {
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(getResources().getString(R.string.faqs_btn));

            actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
            actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)

            // Change color image back, set a custom icon for the default home button
            final Drawable upArrow = ContextCompat.getDrawable(context, R.drawable.abc_ic_ab_back_mtrl_am_alpha);
            upArrow.setColorFilter(ContextCompat.getColor(context, R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
            actionBar.setHomeAsUpIndicator(upArrow);
        }
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.menu_main, menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        /* Handle action bar item clicks here. The action bar will automatically handle clicks on the Home/Up button,
            so long as you specify a parent activity in AndroidManifest.xml.
        */
        switch (item.getItemId()) {
            case android.R.id.home:
                String page = bundle.getString("msg");
                assert page != null;
                if (page.equalsIgnoreCase("ConfirmFAQs")) {
                    ifaqsPresenter.backToHome(true);
                } else
                    ifaqsPresenter.backToHome(false);
                return true;

            default:
                return super.onOptionsItemSelected(item);
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
        if (getView() != null) {
            getView().setFocusableInTouchMode(true);
            getView().requestFocus();
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
}
