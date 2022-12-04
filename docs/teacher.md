# Instructions for teachers

## Taking Code Vault into use

When Code Vault is launched for the first time for a new course in the course
management system, a new Code Vault instance is automatically generated. There
is no need to request a new instance from your system admins if they have
configured the required LTI settings in the course management system so that you
can add Code Vault as a part of your course in the CMS.

## Settings

As a teacher you can configure settings for your course by selecting the
Settings tab. Remember to save the settings by clicking Save in the bottom of
the page.

The following options are available:

**Course name**: The name of the course shown in the top of the page. The
default value for the name is taken from the initial launch of Code Vault from
the course management system.

**Combine with**: If there are multiple course codes in use although they
basically share the same course instance, it is possible to combine Code Vaults
so that only a single Code Vault is used for the all courses. Check the correct
Course id field above of that course which shall remain in use and paste the
value in this field.

After this setting is stored, all the other users except the course teacher are
redirected to the defined Course Vault instance.

**Default UI language**: This option is valid only if the course management
system does not provide the preferred language. In this case the user interface
will use the language specified here.

**Programming language**: This setting is optional and affects the syntax
highlighting. The used code library can automatically detect the correct
language but if it does not work properly, it is possible to define the used
language here.

See the list [here](https://highlightjs.org/download/). Code Vault uses the
common bundle containing the most typical languages. Also Scala programming
language is added to the bundle.

**Expiration**: This setting defines how many days the content is stored in Code
Vault which after the items are automatically removed.

**Quota size**: It is possible to adjust how much content each student can store
to Code Vault in this course. The limit is defined as kilobytes.

All the content is stored to Code Vault's database shared with all courses so
the value should not be too high to avoid using all disk space.
