const mongoose = require('mongoose')

/**
 * @class UploadHelper
 * @description Upload files helper
 */
module.exports = class UploadHelper {
  constructor() {}

  /**
   * @method handleImage
   * @description Handle upload of image file
   * @param {string} template
   * @param {string} subject
   * @param {string} email_address
   */
  async handleImage(request, name, path) {
    if (!request.files || request.files[name] === undefined) return { error: false, filename: null }
    let file = request.files[name]
    let extension = /[^.]+$/.exec(file.name)
    let filename_without_extension = file.name.replace('.' + extension, '')
    let filename = name + '-' + filename_without_extension + '-' + mongoose.Types.ObjectId() + '.' + extension
    filename = filename.replace(/ /g, '-')
    let new_filename = root_directory + path + filename
    let move_response = await file.mv(new_filename)
    if (move_response) return { error: true, message: 'Unable to upload file' }

    // ^ @TODO add error logging
    return { error: false, filename: filename }
  }

  /**
   * @method handleDelete
   * @description delete a file
   * @param {string} filename
   */
  async handleDelete(filename) {
    let file_path = root_directory + '/public/images/' + filename
    if (fs.existsSync(file_path)) {
      fs.unlinkSync(file_path)
    }
  }
}
