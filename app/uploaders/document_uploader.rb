# encoding: utf-8

class DocumentUploader < CarrierWave::Uploader::Base

  # include CarrierWave::RMagick

  storage :fog
  
  include CarrierWave::MimeTypes
  process :set_content_type
  
  def store_dir
    nil
  end

end
