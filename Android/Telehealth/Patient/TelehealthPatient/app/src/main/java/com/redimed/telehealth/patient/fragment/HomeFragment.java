package com.redimed.telehealth.patient.fragment;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.utils.PageIndicator;
import com.redimed.telehealth.patient.utils.SliderImageAdapter;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class HomeFragment extends Fragment implements View.OnClickListener {

    private String TAG = "HOME";
    private View v;
    private SliderImageAdapter sliderImageAdapter;
    private boolean shouldFinish = false;
    private int currentItem = 0;
    private Fragment f;

    @Bind(R.id.btnInformation)
    Button btnInformation;
    @Bind(R.id.btnTelehealth)
    Button btnTelehealth;
    @Bind(R.id.btnFAQ)
    Button btnFAQ;
    @Bind(R.id.btnContact)
    Button btnContact;
    @Bind(R.id.btnUrgentCare)
    Button btnUrgentCare;
    @Bind(R.id.slider)
    ViewPager slider;
    @Bind(R.id.circleIndicator)
    PageIndicator circleIndicator;

    public HomeFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        v = inflater.inflate(R.layout.fragment_home, container, false);
        ButterKnife.bind(this, v);

        sliderImageAdapter = new SliderImageAdapter(v.getContext());
        slider.setAdapter(sliderImageAdapter);
        circleIndicator.setViewPager(slider);

        final int totalPage = slider.getAdapter().getCount();
        final Handler handler = new Handler();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                circleIndicator.setCurrentItem(currentItem++);
                if (currentItem == totalPage){
                    currentItem = 0;
                }
                handler.postDelayed(this, 4000);
            }
        };
        handler.postDelayed(runnable, 4000);

        btnInformation.setOnClickListener(this);
        btnTelehealth.setOnClickListener(this);
        btnFAQ.setOnClickListener(this);
        btnContact.setOnClickListener(this);
        btnUrgentCare.setOnClickListener(this);

        return v;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnInformation:
                ((MainActivity) v.getContext()).Display(1);
                break;
            case R.id.btnTelehealth:
                ((MainActivity) v.getContext()).Display(2);
                break;
            case R.id.btnFAQ:
                ((MainActivity) v.getContext()).Display(3);
                break;
            case R.id.btnUrgentCare:
                UrgentCareFAQ();
                break;
            case R.id.btnContact:
                Contact();
                break;
        }
    }

    private void UrgentCareFAQ(){
        f = new FAQsFragment();
        Bundle bundle = new Bundle();
        bundle.putString("urgentCare", "UR");
        f.setArguments(bundle);
        if (f != null) {
            FragmentManager fragmentManager = getActivity().getSupportFragmentManager();
            fragmentManager.beginTransaction().replace(R.id.frame_container, f).addToBackStack(null).commit();
        }
    }

    private void Contact() {
        Log.d(TAG, "CALL");
        Uri call = Uri.parse("tel:" + getResources().getString(R.string.phone_call));
        Intent phoneCallIntent = new Intent(Intent.ACTION_CALL, call);
        startActivity(phoneCallIntent);
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
                    if (!shouldFinish) {
                        Toast.makeText(v.getContext(), R.string.confirm_exit, Toast.LENGTH_SHORT).show();
                        shouldFinish = true;
                        return true;
                    }
                }
                return false;
            }
        });
    }
}
