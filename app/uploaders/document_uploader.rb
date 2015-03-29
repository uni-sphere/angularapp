# encoding: utf-8

class DocumentUploader < CarrierWave::Uploader::Base

  include CarrierWave::RMagick

  storage :fog
  
  include CarrierWave::MimeTypes
  process :set_content_type
  
  def store_dir
    nil
  end
  
  def cover 
    manipulate! do |frame, index|
      frame if index.zero?
    end
  end   

  version :thumb do
    process :cover
    process :resize_to_fill => [150, 210]
    process :convert => :jpg

    def full_filename (for_file = model.source.file)
      super.chomp(File.extname(super)) + '.jpg'
    end
  end

end
