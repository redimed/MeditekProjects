package com.redimed.telehealth.patient.utils;

import android.net.Uri;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.redimed.telehealth.patient.R;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.List;

public class RVAdapterImage extends RecyclerView.Adapter<RVAdapterImage.ImageListViewHolder>{

    private List<String> fileUploads;
    private View view;

    public void swapData(List<String> data){
        fileUploads.clear();
        fileUploads.addAll(data);
        notifyDataSetChanged();
    }

    public RVAdapterImage() {
        this.fileUploads = new ArrayList<String>();
    }

    @Override
    public ImageListViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cardview_image_appointment, parent, false);
        ImageListViewHolder imageListViewHolder = new ImageListViewHolder(view);
        return imageListViewHolder;
    }

    @Override
    public void onBindViewHolder(final ImageListViewHolder holder, final int position) {
        Picasso picasso = new Picasso.Builder(view.getContext()).listener(new Picasso.Listener() {
            @Override
            public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
//                holder.imgContains.setVisibility(View.GONE);
            }
        }).build();
        picasso.load(fileUploads.get(position)).error(R.drawable.error_image_icon).fit().centerCrop().into(holder.imgContains);
    }

    @Override
    public int getItemCount() {
        return fileUploads.size();
    }

    public static class ImageListViewHolder extends RecyclerView.ViewHolder{
        ImageView imgContains;
        RecyclerView rvImageAppointment;
        CardView cardViewImageApp;

        public ImageListViewHolder(View itemView) {
            super(itemView);
            imgContains = (ImageView) itemView.findViewById(R.id.imgContains);
            rvImageAppointment = (RecyclerView) itemView.findViewById(R.id.rvImageAppointment);
            cardViewImageApp = (CardView) itemView.findViewById(R.id.cardViewImageApp);
        }
    }
}
