package com.redimed.telehealth.patient;

import android.content.Intent;
import android.content.SharedPreferences;
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
import android.webkit.WebBackForwardList;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.fragment.FAQsFragment;
import com.redimed.telehealth.patient.fragment.HomeFragment;
import com.redimed.telehealth.patient.fragment.InformationFragment;
import com.redimed.telehealth.patient.fragment.TelehealthFragment;
import com.redimed.telehealth.patient.models.Category;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;
import com.redimed.telehealth.patient.utils.RVAdapter;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class MainActivity extends AppCompatActivity{

    private String TAG ="MAIN";
    private ActionBarDrawerToggle actionDrawerToggle;
    private RegisterApi restClient;
    private LinearLayoutManager layoutManagerCategories;
    private RVAdapter rvAdapter;
    private List<Category> categories;
    private TelehealthUser telehealthUser;
    private SharedPreferences uidTelehealth;
    private Gson gson;

    @Bind(R.id.frame_container)
    FrameLayout main_contain;
    @Bind(R.id.drawerCategories)
    DrawerLayout drawerCategories;
    @Bind(R.id.rvCategories)
    RecyclerView rvCategories;
    @Bind(R.id.lblNamePatient)
    TextView lblNamePatient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        getIntent().setAction("Already created");

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        startService(new Intent(getApplicationContext(), SocketService.class));
        ButterKnife.bind(this);
        initializeData();
        restClient = RESTClient.getRegisterApi();

        rvCategories.setHasFixedSize(true);
        layoutManagerCategories = new LinearLayoutManager(getApplicationContext());
        rvCategories.setLayoutManager(layoutManagerCategories);
        rvAdapter = new RVAdapter(categories);
        rvCategories.setAdapter(rvAdapter);

        DisplayDrawer();
        GetDetailsPatient();
    }

    private void initializeData(){
        categories = new ArrayList<Category>();
        categories.add(new Category(R.drawable.person_icon, "Home", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "Information", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "Telehealth", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "FAQs", R.drawable.circled_chevron_right_icon));
    }

    private void GetDetailsPatient() {
        String authToken = "", coreToken = "";
        uidTelehealth = this.getSharedPreferences("TelehealthUser", MODE_PRIVATE);
        gson = new Gson();

        telehealthUser = new TelehealthUser();
        telehealthUser.setUID(uidTelehealth.getString("uid", null));
        authToken = "Bearer " + uidTelehealth.getString("token", null);
        coreToken = "Bearer " + uidTelehealth.getString("coreToken", null);
        JsonObject patientJSON = new JsonObject();
        patientJSON.addProperty("data", gson.toJson(telehealthUser));
        restClient.getDetailsPatient(authToken, coreToken, patientJSON,  new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    SharedPreferences.Editor patientInfo = getSharedPreferences("PatientInfo", MODE_PRIVATE).edit();
                    patientInfo.putString("info", jsonObject.get("data").toString());
                    patientInfo.commit();
                    Display(1);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                    new DialogConnection(MainActivity.this).show();
                } else {
                    new CustomAlertDialog(MainActivity.this, CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                }
            }
        });
    }

    // TODO: 10/21/2015  
//    @Override
//    protected void onResume() {
//        String action = getIntent().getAction();
//        if (action == null || !action.equals("Already created")){
//            Intent intent = new Intent(this, MainActivity.class);
//            startActivity(intent);
//            finish();
//        }else
//            getIntent().setAction(null);
//        super.onResume();
//    }

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
            case 3:
                fragment = new FAQsFragment();
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
}
