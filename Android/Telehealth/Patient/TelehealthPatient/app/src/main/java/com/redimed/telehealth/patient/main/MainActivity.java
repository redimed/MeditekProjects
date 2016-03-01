package com.redimed.telehealth.patient.main;

import android.os.Bundle;

import android.support.v4.app.Fragment;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.RecyclerView;

import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.main.view.IMainView;

import butterknife.Bind;
import butterknife.ButterKnife;

public class MainActivity extends AppCompatActivity implements IMainView {

    @Bind(R.id.frame_container)
    FrameLayout main_contain;
    @Bind(R.id.drawerCategories)
    DrawerLayout drawerCategories;
    @Bind(R.id.rvCategories)
    RecyclerView rvCategories;
    @Bind(R.id.lblNamePatient)
    TextView lblNamePatient;
    @Bind(R.id.avatarPatient)
    ImageView avatarPatient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);

        IMainPresenter iMainPresenter = new MainPresenter(this, this);
        iMainPresenter.replaceFragment(new HomeFragment());
    }

    @Override
    public void initDrawer() {
        // TODO: 1/14/2016 Generation Drawer
    }

    @Override
    public void drawerInfoPatient(String dataPatient) {
        // TODO: 1/14/2016 Display Information Patient on Drawer
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
