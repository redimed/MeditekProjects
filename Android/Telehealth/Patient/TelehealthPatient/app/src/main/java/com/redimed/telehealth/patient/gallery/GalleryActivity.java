package com.redimed.telehealth.patient.gallery;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.GridView;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.gallery.presenter.GalleryPresenter;
import com.redimed.telehealth.patient.gallery.presenter.IGalleryPresenter;
import com.redimed.telehealth.patient.gallery.view.IGalleryView;
import com.redimed.telehealth.patient.utlis.AdapterGallery;

import butterknife.Bind;
import butterknife.ButterKnife;

public class GalleryActivity extends AppCompatActivity implements IGalleryView, View.OnClickListener {

    private IGalleryPresenter iGalleryPresenter;
    private String TAG = "=====GALLERY_ACTIVITY=====";

    private Handler handler;
    private AdapterGallery adapterGallery;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.btnBack)
    Button btnBack;

    @Bind(R.id.gridGallery)
    GridView gridGallery;
    @Bind(R.id.btnGalleryOk)
    Button btnSubmit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gallery_gridview);
        ButterKnife.bind(this);

        String action = getIntent().getAction();
        if (action == null) {
            finish();
        }
        init();
    }

    @Override
    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = this;
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.title_gallery));
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    private void init() {
        iGalleryPresenter = new GalleryPresenter(this, this);

        adapterGallery = new AdapterGallery(this);
        adapterGallery.setMultiplePick(true);
        gridGallery.setAdapter(adapterGallery);

        handler = new Handler();
        new Thread() {
            @Override
            public void run() {
                Looper.prepare();
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        adapterGallery.addAll(iGalleryPresenter.getGalleryPhotos());
                    }
                });
                Looper.loop();
            };
        }.start();

        //action
        gridGallery.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                adapterGallery.changeSelection(view, position);
            }
        });
        btnSubmit.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnGalleryOk:
                iGalleryPresenter.selectedImages(adapterGallery);
                break;
        }
    }

    @Override
    public void onLoadPath(String[] allPath) {
        Intent data = new Intent().putExtra("all_path", allPath);
        setResult(RESULT_OK, data);
        finish();
    }
}
