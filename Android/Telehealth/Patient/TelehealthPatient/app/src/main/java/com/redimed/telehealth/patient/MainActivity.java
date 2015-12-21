package com.redimed.telehealth.patient;

import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
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
import com.redimed.telehealth.patient.fragment.ListAppointmentFragment;
import com.redimed.telehealth.patient.models.Category;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.CircleTransform;
import com.redimed.telehealth.patient.utils.Config;
import com.redimed.telehealth.patient.utils.DialogAlert;
import com.redimed.telehealth.patient.utils.DialogConnection;
import com.redimed.telehealth.patient.utils.RVAdapter;
import com.squareup.picasso.MemoryPolicy;
import com.squareup.picasso.NetworkPolicy;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.UrlConnectionDownloader;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class MainActivity extends AppCompatActivity {

    private Gson gson;
    private Fragment fragment;
    private RVAdapter rvAdapter;
    private RegisterApi restClient;
    private List<Category> categories;
    private SharedPreferences uidTelehealth, spDevice;
    private ActionBarDrawerToggle actionDrawerToggle;
    private LinearLayoutManager layoutManagerCategories;
    private String TAG = "MAIN", firstName, lastName, url;


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

        gson = new Gson();
        restClient = RESTClient.getRegisterApi();
        spDevice = this.getSharedPreferences("DeviceInfo", MODE_PRIVATE);
        uidTelehealth = this.getSharedPreferences("TelehealthUser", MODE_PRIVATE);

        initializeData();
        rvCategories.setHasFixedSize(true);
        layoutManagerCategories = new LinearLayoutManager(getApplicationContext());
        rvCategories.setLayoutManager(layoutManagerCategories);
        rvAdapter = new RVAdapter(getApplicationContext(), 0);
        rvAdapter.swapDataCategory(categories);
        rvCategories.setAdapter(rvAdapter);

        DisplayDrawer();
        GetDetailsPatient();
        SendToken();
        Display(0);
    }

    private void initializeData() {
        categories = new ArrayList<Category>();
        categories.add(new Category(R.drawable.person_icon, "Home"));
        categories.add(new Category(R.drawable.person_icon, "Information"));
        categories.add(new Category(R.drawable.person_icon, "Telehealth"));
        categories.add(new Category(R.drawable.person_icon, "FAQs"));
        categories.add(new Category(R.drawable.person_icon, getApplicationContext().getResources().getString(R.string.unregistered)));
    }

    private void GetDetailsPatient() {
        restClient.getDetailsPatient(uidTelehealth.getString("uid", null), new Callback<JsonObject>() {
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
                    new DialogAlert(MainActivity.this, DialogAlert.State.Error, error.getLocalizedMessage()).show();
                }
            }
        });
    }

    private void DisplaySoftInfoPatient(String data) {
        Patient[] patients = gson.fromJson(data, Patient[].class);
        for (Patient patient : patients) {
            firstName = patient.getFirstName() == null ? " " : patient.getFirstName();
            lastName = patient.getLastName() == null ? " " : patient.getLastName();
            url = Config.apiURLDownload + patient.getFileUID() == null ? " " : Config.apiURLDownload + patient.getFileUID();
        }
        lblNamePatient.setText(firstName + " " + lastName);

        Picasso picasso = new Picasso.Builder(this)
                .downloader(new UrlConnectionDownloader(this) {
                    @Override
                    protected HttpURLConnection openConnection(Uri uri) throws IOException {
                        HttpURLConnection connection = super.openConnection(uri);
                        connection.addRequestProperty("Authorization", "Bearer " + uidTelehealth.getString("token", null));
                        connection.addRequestProperty("DeviceID", uidTelehealth.getString("deviceID", null));
                        connection.addRequestProperty("SystemType", "ARD");
                        connection.addRequestProperty("Cookie", uidTelehealth.getString("cookie", null));
                        connection.addRequestProperty("AppID", "com.redimed.telehealth.patient");
                        return connection;
                    }
                })
                .listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d("ERROR PICASSO", exception.getLocalizedMessage());
                    }
                }).build();

        picasso.load(url)
                .memoryPolicy(MemoryPolicy.NO_CACHE)
                .networkPolicy(NetworkPolicy.NO_CACHE)
                .transform(new CircleTransform())
                .error(R.drawable.icon_error_image)
                .into(avatarPatient);
    }

    //Initialize Drawer
    private void DisplayDrawer() {
        actionDrawerToggle = new ActionBarDrawerToggle(this, drawerCategories, null, R.string.drawer_open, R.string.drawer_close) {
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

    public void Display(int position) {
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
                fragment = new ListAppointmentFragment();
                break;
            case 3:
                fragment = new FAQsFragment();
                break;
            case 4:
                DialogConfirm();
                break;
            default:
                break;
        }
        if (fragment != null) {
            PerformNoBackStackTransaction(fragment);
            drawerCategories.closeDrawer(Gravity.LEFT);
        } else {
            Log.e("MainActivity", "Error in creating fragment");
        }
    }

    //Display dialog choose camera or gallery to upload image
    private void DialogConfirm() {
        final android.support.v7.app.AlertDialog alertDialog = new android.support.v7.app.AlertDialog.Builder(this).create();
        alertDialog.setTitle(getApplicationContext().getResources().getString(R.string.unregistered));
        alertDialog.setMessage(getApplicationContext().getResources().getString(R.string.un_title));

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Unregistered", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                MyApplication.getInstance().clearApplication();
                finish();
                startActivity(new Intent(getApplicationContext(), LauncherActivity.class));
            }
        });

        alertDialog.setButton(Dialog.BUTTON_POSITIVE, "Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                alertDialog.cancel();
            }
        });
        alertDialog.show();
    }

    public void PerformNoBackStackTransaction(Fragment fragment) {
        final FragmentManager fragmentManager = getSupportFragmentManager();
        final int newBackStackLength = fragmentManager.getBackStackEntryCount() + 1;

        fragmentManager.beginTransaction()
                .replace(R.id.frame_container, fragment)
                .addToBackStack(null)
                .commit();

        fragmentManager.addOnBackStackChangedListener(new FragmentManager.OnBackStackChangedListener() {
            @Override
            public void onBackStackChanged() {
                int nowCount = fragmentManager.getBackStackEntryCount();
                if (newBackStackLength != nowCount) {
                    fragmentManager.removeOnBackStackChangedListener(this);

                    if (newBackStackLength > nowCount) {
                        fragmentManager.popBackStackImmediate();
                    }
                }
            }
        });
    }

    private void SendToken(){
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("token", spDevice.getString("gcmToken", null));
        jsonObject.addProperty("uid", uidTelehealth.getString("uid", null));
        JsonObject dataJson = new JsonObject();
        dataJson.addProperty("data", gson.toJson(jsonObject));
        restClient.updateToken(dataJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
//                Log.d(TAG, jsonObject.toString());
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }
}
