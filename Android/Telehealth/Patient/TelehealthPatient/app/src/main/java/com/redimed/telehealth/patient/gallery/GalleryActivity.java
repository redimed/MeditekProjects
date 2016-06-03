package com.redimed.telehealth.patient.gallery;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
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

    private Handler handler;
    private AdapterGallery adapterGallery;
    private IGalleryPresenter iGalleryPresenter;
    private static final String TAG = "=====GALLERY_ACTIVITY=====";

    @Bind(R.id.toolBar)
    Toolbar toolBar;
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

    private void init() {
        iGalleryPresenter = new GalleryPresenter(this, this, this);
        iGalleryPresenter.initToolbar(toolBar);

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
            }
        }.start();

        // action
        gridGallery.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                adapterGallery.changeSelection(view, position);
            }
        });
        btnSubmit.setOnClickListener(this);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
         /* Handle action bar item clicks here. The action bar will automatically handle clicks on the Home/Up button,
            so long as you specify a parent activity in AndroidManifest.xml.
        */
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
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
