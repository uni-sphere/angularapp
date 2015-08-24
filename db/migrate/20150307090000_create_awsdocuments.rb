class CreateAwsdocuments < ActiveRecord::Migration
  def change
    create_table :awsdocuments do |t|
      t.string :content
      t.string :title
      t.text :url
      t.integer :user_id
			t.integer :chapter_id
      t.integer :organization_id
      t.boolean :archived, default: false
			
      t.timestamps
    end
  end
end