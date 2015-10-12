package com.redimed.telehealth.patient;

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.fragment.HomeFragment;
import com.redimed.telehealth.patient.fragment.InformationFragment;
import com.redimed.telehealth.patient.fragment.TelehealthFragment;
import com.redimed.telehealth.patient.models.Category;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.RVAdapter;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

public class MainActivity extends AppCompatActivity{

    private String TAG ="HOME";
    private ActionBarDrawerToggle actionDrawerToggle;
    private boolean shouldFinish = false;
    private RegisterApi restClient;
    private LinearLayoutManager layoutManagerCategories;
    private RVAdapter rvAdapter;
    private List<Category> categories;

    @Bind(R.id.frame_container)
    FrameLayout main_contain;
    @Bind(R.id.drawerCategories)
    DrawerLayout drawerCategories;
    @Bind(R.id.rvCategories)
    RecyclerView rvCategories;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        startService(new Intent(getApplicationContext(), SocketService.class));

        restClient = RESTClient.getRegisterApi();
        ButterKnife.bind(this);
        initializeData();

        rvCategories.setHasFixedSize(true);
        layoutManagerCategories = new LinearLayoutManager(getApplicationContext());
        rvCategories.setLayoutManager(layoutManagerCategories);
        rvAdapter = new RVAdapter(categories);
        rvCategories.setAdapter(rvAdapter);

        DisplayDrawer();
        Display(0);
    }

    private void initializeData(){
        categories = new ArrayList<Category>();
        categories.add(new Category(R.drawable.share_image_icon, "Home", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "Information", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.share_image_icon, "Share Image", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "Menu3", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.share_image_icon, "Menu4", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "Menu5", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.share_image_icon, "Menu6", R.drawable.circled_chevron_right_icon));
    }

    //Initialize Drawer
    private void DisplayDrawer() {
        actionDrawerToggle = new ActionBarDrawerToggle(this, drawerCategories, null, R.string.drawer_open, R.string.drawer_close){
            @Override
            public void onDrawerSlide(View drawerView, float slideOffset) {
                super.onDrawerSlide(drawerView, slideOffset);
                main_contain.setTranslationX(slideOffset * drawerView.getWidth());
                drawerCategories.bringChildToFront(drawerView);
                drawerView.requestLayout();
            }
            @Override
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
            }

            @Override
            public void onDrawerClosed(View drawerView) {
                super.onDrawerClosed(drawerView);
            }
        };
        drawerCategories.setDrawerListener(actionDrawerToggle);
        actionDrawerToggle.syncState();
    }

    public void Display(int position){
        Log.d("POSITION", position + "");
        Fragment fragment = null;
        switch (position) {
            case 0:
                fragment = new HomeFragment();
                break;
            case 1:
                fragment = new InformationFragment();
                break;
            case 2:
                fragment = new TelehealthFragment();
                break;
            default:
                break;
        }
        if (fragment != null) {
            FragmentManager fragmentManager = getSupportFragmentManager();
            fragmentManager.beginTransaction().replace(R.id.frame_container, fragment).commit();
            drawerCategories.closeDrawer(Gravity.LEFT);
        } else {
            Log.e("MainActivity", "Error in creating fragment");
        }
    }

//    @Override
//    public void onBackPressed() {
//        if (!shouldFinish){
//            Toast.makeText(getApplicationContext(), R.string.confirm_exit, Toast.LENGTH_SHORT).show();
//            shouldFinish = true;
//        }
//        else {
//            super.onBackPressed();
//        }
//    }
}
