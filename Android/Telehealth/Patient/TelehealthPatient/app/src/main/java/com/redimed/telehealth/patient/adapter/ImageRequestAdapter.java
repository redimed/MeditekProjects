package com.redimed.telehealth.patient.adapter;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.models.CustomGallery;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Fox on 1/26/2016.
 */
public class ImageRequestAdapter extends RecyclerView.Adapter<ImageRequestAdapter.ImageListViewHolder> {

    private final Context context;
    private final LayoutInflater inflater;
    private ArrayList<CustomGallery> fileUploads;

    public ImageRequestAdapter(ArrayList<CustomGallery> fileUploads, Context context) {
        this.context = context;
        this.fileUploads = fileUploads;
        this.inflater = LayoutInflater.from(context);
    }

    @Override
    public ImageListViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_image_appointment, parent, false);
        return new ImageListViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ImageListViewHolder holder, int position) {
        holder.progressBar.setVisibility(View.VISIBLE);

        int myWidth = 300;
        int myHeight = 300;
        Glide.with(context).load(fileUploads.get(position).sdcardPath)
                .asBitmap()
                .into(new SimpleTarget<Bitmap>(myWidth, myHeight) {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation glideAnimation) {
                        holder.progressBar.setVisibility(View.GONE);
                        holder.imgContains.setImageBitmap(resource);
                    }

                    @Override
                    public void onLoadFailed(Exception e, Drawable errorDrawable) {
                        Log.d("ADAPTER", e.toString());
                    }
                });
    }

    @Override
    public int getItemCount() {
        return fileUploads.size();
    }

    public class ImageListViewHolder extends RecyclerView.ViewHolder {

        @Bind(R.id.imgContains)
        ImageView imgContains;
        @Bind(R.id.progressBar)
        ProgressBar progressBar;

        public ImageListViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
        }

    }
}
