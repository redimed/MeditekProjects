package com.redimed.telehealth.patient.utlis;

import android.content.Context;
import android.support.v4.view.PagerAdapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.bumptech.glide.Glide;
import com.redimed.telehealth.patient.R;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Lam on 11/2/2015.
 */
public class AdapterSlider extends PagerAdapter {

    private Context context;
    private LayoutInflater inflater;
    private int[] resourcesIMG = {
            R.drawable.slider1,
            R.drawable.slider2,
            R.drawable.slider3,
    };

    @Bind(R.id.imgSlider)
    ImageView imgSlider;


    public AdapterSlider(Context ctx) {
        this.context = ctx;
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return resourcesIMG.length;
    }

    @Override
    public boolean isViewFromObject(View view, Object object) {
        return view == ((RelativeLayout) object);
    }

    @Override
    public Object instantiateItem(ViewGroup container, int position) {
        View viewLayout = inflater.inflate(R.layout.slider_image, container, false);
        ButterKnife.bind(this, viewLayout);
        Glide.with(viewLayout.getContext())
                .load(resourcesIMG[position])
                .fitCenter()
                .centerCrop()
                .into(imgSlider);
        container.addView(viewLayout);

        return viewLayout;
    }

    @Override
    public void destroyItem(ViewGroup container, int position, Object object) {
        container.removeView((RelativeLayout) object);
    }
}
