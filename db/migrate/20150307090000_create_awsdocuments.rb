class CreateAwsdocuments < ActiveRecord::Migration
  def change
    create_table :awsdocuments do |t|
      t.string :content
      t.string :type
      t.string :name
			t.integer :node_id
      t.boolean :archived, default: false
			
      t.timestamps
    end
  end
end