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
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.fragment.FAQsFragment;
import com.redimed.telehealth.patient.fragment.HomeFragment;
import com.redimed.telehealth.patient.fragment.InformationFragment;
import com.redimed.telehealth.patient.fragment.TelehealthFragment;
import com.redimed.telehealth.patient.models.Category;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.CircleTransform;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;
import com.redimed.telehealth.patient.utils.RVAdapter;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class MainActivity extends AppCompatActivity{

    private String TAG ="MAIN", firstName, lastName;
    private ActionBarDrawerToggle actionDrawerToggle;
    private RegisterApi restClient;
    private LinearLayoutManager layoutManagerCategories;
    private RVAdapter rvAdapter;
    private List<Category> categories;
    private TelehealthUser telehealthUser;
    private SharedPreferences uidTelehealth;
    private Gson gson;
    private Fragment fragment;
    private boolean resumeHasRun = false;

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

        Display(1);
    }

    private void initializeData(){
        categories = new ArrayList<Category>();
        categories.add(new Category(R.drawable.person_icon, "Home", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "Information", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "Telehealth", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "FAQs", R.drawable.circled_chevron_right_icon));
    }

    private void GetDetailsPatient() {
        uidTelehealth = this.getSharedPreferences("TelehealthUser", MODE_PRIVATE);
        gson = new Gson();

        telehealthUser = new TelehealthUser();
        telehealthUser.setUID(uidTelehealth.getString("uid", null));

        JsonObject patientJSON = new JsonObject();
        patientJSON.addProperty("data", gson.toJson(telehealthUser));
        restClient.getDetailsPatient(patientJSON, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    SharedPreferences.Editor patientInfo = getSharedPreferences("PatientInfo", MODE_PRIVATE).edit();
                    patientInfo.putString("info", jsonObject.get("data").toString());
                    patientInfo.commit();
                    DisplaySoftInfoPatient(jsonObject.get("data").toString());
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

    private void DisplaySoftInfoPatient(String data){
        Patient[] patients = gson.fromJson(data, Patient[].class);
        for (Patient patient: patients){
            firstName = patient.getFirstName() == null ? " " : patient.getFirstName();
            lastName = patient.getLastName() == null ? " " : patient.getLastName();
        }
        lblNamePatient.setText(firstName + " " + lastName);

        Picasso.with(this).load(R.drawable.blank_avatar)
                .transform(new CircleTransform())
                .resize(200, 200)
                .centerCrop()
                .into(avatarPatient);

        avatarPatient.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // TODO: 10/28/2015  update avatar
            }
        });
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
        switch (position) {
            case 0:
                fragment = new HomeFragment();
                break;
            case 1:
                Bundle bundle = new Bundle();
                bundle.putString("telehealthUID", uidTelehealth.getString("uid", null));
                fragment = new InformationFragment();
                fragment.setArguments(bundle);
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
            fragmentManager.beginTransaction().replace(R.id.frame_container, fragment).addToBackStack(null).commit();
            drawerCategories.closeDrawer(Gravity.LEFT);
        } else {
            Log.e("MainActivity", "Error in creating fragment");
        }
    }
}
