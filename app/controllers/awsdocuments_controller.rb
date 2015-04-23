class AwsdocumentsController < ApplicationController

  def create
    awsdocument = current_chapter.awsdocuments.new(title: params[:title], content: params[:file])
    if awsdocument.save
      render json: awsdocument, status: 201, location: awsdocument
    else
      render json: awsdocument.errors, status: 422
    end
  end
  
  def show
    preview_link = current_awsdocument.content.file.authenticated_url
    render json: preview_link, status: 200
  end
  
  def archives
    current_awsdocuments = current_node.awsdocuments.where(archived: false)
  end
  
  def unarchive
    if current_awsdocument.unarchive
      render json: current_awsdocument, status: 200
    else
      render json: current_awsdocument.errors, status: 422
    end
  end
  
  def update
    if current_awsdocument.update(title: params[:title])
      render json: current_awsdocument, status: 200
    else
      render json: current_awsdocument.errors, status: 422
    end
  end
  
  def destroy
    current_awsdocument.archive
    head 204
  end
  
end